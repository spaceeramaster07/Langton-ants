// ants/presets.js
const antPresets = {
    langtons: {
        name: "Langton's Ant (White)",
        rules: {
            0: { writeColor: 1, move: 'R' },
            1: { writeColor: 0, move: 'L' }
        }
    },
    langtonsMagenta: {
        name: "Langton's Ant (Magenta)",
        rules: {
            0: { writeColor: 2, move: 'R' },
            2: { writeColor: 0, move: 'L' }
        }
    },
    langtonsLime: {
        name: "Langton's Ant (Lime)",
        rules: {
            0: { writeColor: 4, move: 'R' },
            4: { writeColor: 0, move: 'L' }
        }
    },
    langtonsBlue: {
        name: "Langton's Ant (Blue)",
        rules: {
            0: { writeColor: 8, move: 'R' },
            8: { writeColor: 0, move: 'L' }
        }
    },
    colorJumper: {
        name: "Multi colour Langton's Ant (RLRLR)",
        rules: {
            0: { writeColor: 4, move: 'R' },
            4: { writeColor: 7, move: 'L' },
            7: { writeColor: 9, move: 'R' },
            9: { writeColor: 11, move: 'L' },
            11: { writeColor: 0, move: 'R' }
        }
    },
    symmetricalLLRR: {
        name: "Symmetric Expand (LLRR)",
        rules: {
            0: { writeColor: 1, move: 'L' },
            1: { writeColor: 2, move: 'L' },
            2: { writeColor: 3, move: 'R' },
            3: { writeColor: 0, move: 'R' }
        }
    },
    symmetrical8: {
        name: "Symmetric 8-Color (LLLLRRRR)",
        rules: {
            0: { writeColor: 1, move: 'L' },
            1: { writeColor: 2, move: 'L' },
            2: { writeColor: 3, move: 'L' },
            3: { writeColor: 4, move: 'L' },
            4: { writeColor: 5, move: 'R' },
            5: { writeColor: 6, move: 'R' },
            6: { writeColor: 7, move: 'R' },
            7: { writeColor: 0, move: 'R' }
        }
    },
    triangleGrower: {
        name: "Triangle Grower (RRLLLRLLLRRR)",
        rules: {
            0: { writeColor: 1, move: 'R' },
            1: { writeColor: 2, move: 'R' },
            2: { writeColor: 3, move: 'L' },
            3: { writeColor: 4, move: 'L' },
            4: { writeColor: 5, move: 'L' },
            5: { writeColor: 6, move: 'R' },
            6: { writeColor: 7, move: 'L' },
            7: { writeColor: 8, move: 'L' },
            8: { writeColor: 9, move: 'L' },
            9: { writeColor: 10, move: 'R' },
            10: { writeColor: 11, move: 'R' },
            11: { writeColor: 0, move: 'R' }
        }
    },
    squareFiller: {
        name: "Square Filler (LRRRRRLLR)",
        rules: {
            0: { writeColor: 1, move: 'L' },
            1: { writeColor: 2, move: 'R' },
            2: { writeColor: 3, move: 'R' },
            3: { writeColor: 4, move: 'R' },
            4: { writeColor: 5, move: 'R' },
            5: { writeColor: 6, move: 'R' },
            6: { writeColor: 7, move: 'L' },
            7: { writeColor: 8, move: 'L' },
            8: { writeColor: 0, move: 'R' }
        }
    },
    archimedesSpiral: {
        name: "Archimedes Spiral",
        rules: {
            0: { writeColor: 1, move: 'L' },
            1: { writeColor: 2, move: 'R' },
            2: { writeColor: 3, move: 'R' },
            3: { writeColor: 4, move: 'R' },
            4: { writeColor: 5, move: 'R' },
            5: { writeColor: 6, move: 'L' },
            6: { writeColor: 7, move: 'L' },
            7: { writeColor: 8, move: 'L' },
            8: { writeColor: 9, move: 'R' },
            9: { writeColor: 10, move: 'R' },
            10: { writeColor: 0, move: 'R' }
        }
    },
    logarithmicSpiral: {
        name: "Logarithmic Spiral",
        rules: {
            0: { writeColor: 1, move: 'R' },
            1: { writeColor: 2, move: 'L' },
            2: { writeColor: 3, move: 'L' },
            3: { writeColor: 4, move: 'L' },
            4: { writeColor: 5, move: 'L' },
            5: { writeColor: 6, move: 'R' },
            6: { writeColor: 7, move: 'R' },
            7: { writeColor: 8, move: 'R' },
            8: { writeColor: 9, move: 'L' },
            9: { writeColor: 10, move: 'L' },
            10: { writeColor: 11, move: 'L' },
            11: { writeColor: 0, move: 'R' }
        }
    }
};
