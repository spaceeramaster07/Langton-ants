# Generalized Langton's Ant Simulator

A remarkably lightweight, high-performance web-based simulator for exploring **Langton's Ant** and its incredibly varied multi-color generalizations. Built purely with Vanilla JavaScript, HTML5 Canvas, and CSS, it features a retro Raylib-inspired interface, infinitely expanding toroidal (wrapping) borders, and native interactive camera manipulation.

## What is Langton's Ant?
Invented by Chris Langton in 1986, the standard ant is a two-dimensional universal Turing machine with an extremely simple set of rules. Operating on a square lattice of black and white cells, the ant moves one square diagonally at a time based on these instructions:
* At a **Black** square, turn 90° right, flip the color of the square to white, and move forward one unit.
* At a **White** square, turn 90° left, flip the color of the square to black, and move forward one unit.

Despite the raw simplicity of these two conditions, the behavior is profoundly complex:
1. **Simplicity**: The ant creates simple patterns for the first few hundred steps.
2. **Chaos**: It then enters a massive, pseudo-random chaotic period filled with intricate fractal structures for about 10,000 steps.
3. **Emergent Order ("The Highway")**: Miraculously, all the chaotic variables eventually align, and the ant builds a recurrent "highway" pattern of 104 steps that endlessly repeats diagonally across the screen forever!

## Multicolored Generalizations (Turmites)
While the classic ant is strictly binary (states 0 and 1), **Generalized Langton's Ants** operate using an arbitrary $N$-number of colors. These multi-color variants are defined by a sequence of directional turns (e.g., LLRR) mapping to consecutive integer states. 

Mathematically, the generalized mechanism operates as follows:
When the ant lands on a cell with state index $k$ (where $k$ ranges from $0$ to $N-1$):
1. It performs the rotational turn strictly dictated by the $k$-th mathematical instruction in its configuration.
2. It mutates the cell's physical state locally to $(k + 1) \pmod N$.
3. It steps forward one unit on the integer lattice.

This engine fully supports **Multiple Colors** dynamically, permitting configurations to jump arbitrarily between mathematical indices without sequential restriction. In our custom UI Editor, these generalized properties are expressed as JSON Dictionary Objects, pairing the color index explicitly to the state transition evaluated at runtime:

```javascript
// Native Langton's Ant mathematically defined as (RL)
{
  0: { writeColor: 1, move: 'R' },
  1: { writeColor: 0, move: 'L' }
}
```

### Color Mapping Index
When explicitly defining your custom dictionary subsets, you have 12 mapped color constants at your disposal. Their exact Javascript indices are as follows:
- `0` - Black (Base Canvas Void)
- `1` - White
- `2` - Magenta
- `3` - Yellow
- `4` - Lime
- `5` - Cyan
- `6` - Red
- `7` - Orange
- `8` - Blue
- `9` - Hot Pink
- `10` - Orchid
- `11` - BlueViolet

### Advanced Mathematical Presets Included:
*   **Symmetric Expand (`LLRR`)**: A classic 4-color ant that exhibits extraordinary spatial behavior. Rather than building a localized spinning highway, it blossoms flawlessly outward into a massively expanding, perfectly symmetrical crystalline diamond structure. Research indicates bounding sequences like LLRR produce near-perfect Bilateral Space-Filling Symmetry.
*   **Triangle Grower (`RRLLLRLLLRRR`)**: An immense 12-color algorithmic beast! It burns chaotically over itself for tens of thousands of frames mathematically searching for alignment, before abruptly breaking symmetry to assemble a massive Triangle shape driving rapidly outward.
*   **Square Filler (`LRRRRRLLR`)**: Rather than endlessly extending outwards in a single direction, this massive algorithm bounds itself repetitively via its specific pseudo-random transitions to endlessly map out a near-perfect solid expanding square.
*   **Highway Chaos (`RLR`)**: A notorious 3-color rule sequence famous in computational theory. It grows in a highly chaotic configuration and research has yet to definitively conclude if it ever truly settles into a repetitive "highway" structure regardless of how many millions of iterations it computes!

## Universal Computation & Turing Completeness
Because of the purely deterministic rotational mechanics underlying this cellular automaton, the classic Langton's Ant algorithm is officially proven to be mathematically **Turing Complete**. Theoretically, the engine running this simulator is fully capable of compiling any algorithmic equation that a modern supercomputer can evaluate. 

By pre-painting massive, highly-specific structural "circuits" of black and white pixels on the lattice before releasing the ant, the ant will predictably bounce through the pathways evaluating native Boolean logic configurations to simulate **AND**, **OR**, and **NOT** logical operators. While attempting to manually paint these enormous, million-cell computational circuits by hand using your mouse in this web-app is practically impossible without a massive external file-importing tool, the HTML Canvas mathematical engine processes the fundamental physical mechanics capable of evaluating them perfectly!

## Features
*   **Fully Interactive Canvas**: Click and Drag to smoothly continuously pan across the virtual space. Use your mouse scroll wheel to zoom deeply in or pan vastly out! 
*   **Click to Spawn**: Have `Click to Place Ants` checked? Point literally anywhere on the grid map to natively lock an algorithmic ant onto a track directly on established geometry!
*   **Dynamic Custom Algorithms**: Write explicit Javascript dictionary paths inside the `Custom Rule (JS Object)` box, hit save, and your exact custom algorithm will instantly run! 
*   **Persistent Local Storage**: Any custom preset configuration you write and save is silently embedded onto your local machine so it survives through website refreshes!   
*   **Live Editing Buttons**: 
    - `❚❚`: Pause or Play runtime. 
    - `↺`: Instantly scrub the canvas and deploy exactly one fresh ant to the true center of the board natively.
    - `Ø`: Purge every active algorithmic runner from the board, but safely keep the actual canvas geometries intact! 

## Installation
Absolutely zero backend deployment scaling required! No React, Node, or specific packaging dependencies needed:
1. Download or clone this local repository.
2. Double-click `index.html` on any modern web browser to open. 
3. Select a Preset algorithmic load-out from your drop-down options!
