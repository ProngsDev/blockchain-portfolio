'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from "framer-motion";
import { blocksData, mempoolData } from '@/data';

// Import Block component with client-side only rendering
const Block = dynamic(() => import("@/components/blocks/Block"), {
  ssr: false,
  loading: () => (
    <div className="border border-[#2d2d2d] rounded-lg p-6 bg-[#121212] animate-pulse">
      <div className="h-6 bg-[#1a1a1a] rounded-md mb-4"></div>
      <div className="h-4 bg-[#1a1a1a] rounded-md mb-2 w-3/4"></div>
      <div className="h-4 bg-[#1a1a1a] rounded-md mb-2 w-1/2"></div>
      <div className="h-4 bg-[#1a1a1a] rounded-md w-2/3"></div>
    </div>
  )
});

// Import Mempool component with client-side only rendering
const Mempool = dynamic(() => import("@/components/blocks/Mempool"), {
  ssr: false,
  loading: () => (
    <div className="border border-[#2d2d2d] rounded-lg p-6 bg-[#121212] animate-pulse">
      <div className="h-6 bg-[#1a1a1a] rounded-md mb-4"></div>
      <div className="h-4 bg-[#1a1a1a] rounded-md mb-2 w-3/4"></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-32 bg-[#1a1a1a] rounded-md"></div>
        <div className="h-32 bg-[#1a1a1a] rounded-md"></div>
      </div>
    </div>
  )
});

// Static block hashes for each experience block
// Order: oldest (genesis) to newest
const staticBlockHashes = [
  '0x1c3a5d6bf269f9c5a0a3e8c8a52124b5a02682e1eb7faaa2f7791dc8739f2d6a',  // Computer Science Degree (Genesis)
  '0x2f1b678a5889d890d25c096bd686f76b48d32c6e2ff5fda2a3c031a6fc107e21',  // Frontend Developer
  '0x4b3af30f93c1a5c1236aa4f69a7fb0e29c2f2a3bc93f2b2a0b608e18c2952826',  // Smart Contract Auditor
  '0x7d9c4e35f2d9c74a86a7f81d8d9a5be71848329593f84f2e2a02a28b58bc553c',  // Blockchain Developer
  '0x8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65d6b3aaa7b62548328f'   // Senior Smart Contract Engineer
];

export default function BlocksPage() {
  // State for expanded blocks
  const [expandedBlockIndex, setExpandedBlockIndex] = useState<number | null>(null);



  // Prepare blocks with their static hashes
  // The display order is newest first, but we need to connect them in chronological order
  const blocksWithHashes = blocksData.map((block, index) => {
    // Calculate the reverse index to get the correct hash from oldest to newest
    const reverseIndex = blocksData.length - 1 - index;

    // Get the hash for this block from our static hashes array
    const blockHash = staticBlockHashes[reverseIndex];

    // Calculate block height (newest = highest number)
    const blockHeight = blocksData.length - index;

    // Determine if this is the genesis block (oldest block)
    const isGenesis = index === blocksData.length - 1;

    // Return block with hash information
    return {
      ...block,
      blockHash,
      blockHeight,
      isGenesis
    };
  });

  // Connect blocks by setting previous hash references
  const blocks = blocksWithHashes.map((block, index) => {
    // For the genesis block (last in our array), there's no previous block
    // For all other blocks, use the hash of the chronologically previous block
    const prevBlockHash = index === blocksData.length - 1
      ? "0x0000000000000000000000000000000000000000000000000000000000000000" // Genesis block has no previous
      : staticBlockHashes[blocksData.length - 2 - index]; // Get the hash of the chronologically previous block

    // Return block with previous hash reference
    return {
      ...block,
      prevBlockHash,
      isLastBlock: index === 0 // The first block in the array is the most recent
    };
  });



  // Animation variants with faster transitions
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const lineVariants = {
    hidden: { height: 0 },
    visible: {
      height: "100%",
      transition: {
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  const blockVariants = {
    hidden: () => ({
      opacity: 1,
      x: 0
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const connectorVariants = {
    hidden: { scale: 0.5 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
        delay: 0.1
      }
    }
  };

  // Toggle expanded state for a block
  const toggleExpandBlock = (index: number) => {
    setExpandedBlockIndex(expandedBlockIndex === index ? null : index);
  };

  return (
    <div className="px-4 md:px-8 py-8">
      <motion.div
        className="max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="text-center mb-16"
          variants={headerVariants}
        >
          <h1 className="text-4xl font-bold mb-6">
            <span className="gradient-text">Blockchain Timeline</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            My professional journey as a blockchain developer, represented as a chain of blocks.
            Each block contains details about my experience, with future aspirations waiting in the mempool.
          </p>
        </motion.div>

        {/* Mempool Section - Future Aspirations */}
        <motion.div
          className="mb-24"
          variants={headerVariants}
        >
          <Mempool items={mempoolData} />
        </motion.div>

        {/* Blockchain Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#00ff9d] to-[#00c3ff] rounded-full"
            variants={lineVariants}
          ></motion.div>

          {/* Blocks */}
          <div className="space-y-16">
            {blocks.map((block, index) => (
              <motion.div
                key={index}
                className={`relative ${index % 2 === 0 ? 'left-timeline' : 'right-timeline'}`}
                custom={index}
                variants={blockVariants}
              >
                {/* Block Connector */}
                <motion.div
                  className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-[#00ff9d] border-4 border-[#121212] z-10"
                  variants={connectorVariants}
                ></motion.div>

                {/* Hash Connection to Previous Block */}
                {index < blocks.length - 1 && (
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 h-[calc(100%+4rem)] w-1 flex justify-center items-center pointer-events-none">
                    <motion.div
                      className="text-xs text-[#00ff9d] font-mono bg-[#0a0a0a] px-2 py-1 rounded-full border border-[#2d2d2d] whitespace-nowrap"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 + index * 0.2 }}
                    >
                      Hash Connection
                    </motion.div>
                  </div>
                )}

                {/* Block Content */}
                <div className={`relative w-full md:w-[calc(50%-40px)] ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                  <Block
                    title={block.title}
                    company={block.company}
                    period={block.period}
                    description={block.description}
                    techStack={block.techStack}
                    githubLink={block.githubLink}
                    demoLink={block.demoLink}
                    gasUsed={block.gasUsed}
                    confirmations={block.confirmations}
                    isGenesis={block.isGenesis}
                    blockHash={block.blockHash}
                    prevBlockHash={block.prevBlockHash}
                    blockHeight={block.blockHeight}
                    isLastBlock={block.isLastBlock}
                    expanded={expandedBlockIndex === index}
                    onToggleExpand={() => toggleExpandBlock(index)}
                    showHashConnection={index < blocks.length - 1 && expandedBlockIndex === index}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Blockchain Explorer Legend */}
        <motion.div
          className="mt-24 border border-[#2d2d2d] rounded-lg p-6 bg-[#121212]/50 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <h3 className="text-xl font-bold mb-4 text-[#00ff9d]">Blockchain Explorer Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="w-4 h-4 rounded-full bg-[#00ff9d] mt-1 mr-3"></div>
              <div>
                <h4 className="font-bold text-white">Confirmed Blocks</h4>
                <p className="text-sm text-gray-400">Verified career experiences that have been added to the blockchain.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-4 h-4 rounded-full bg-[#00c3ff] mt-1 mr-3"></div>
              <div>
                <h4 className="font-bold text-white">Mempool</h4>
                <p className="text-sm text-gray-400">Future aspirations and goals waiting to be confirmed on the blockchain.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-4 h-4 rounded-full bg-yellow-500 mt-1 mr-3"></div>
              <div>
                <h4 className="font-bold text-white">Pending Status</h4>
                <p className="text-sm text-gray-400">Goals that are queued but not yet actively being pursued.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-4 h-4 rounded-full bg-blue-500 mt-1 mr-3"></div>
              <div>
                <h4 className="font-bold text-white">In Progress Status</h4>
                <p className="text-sm text-gray-400">Goals that are currently being worked on but not yet completed.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
