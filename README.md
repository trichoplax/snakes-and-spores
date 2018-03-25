# Snakes and spores

A population of evolving snakes reproducing within their environment using motile spores.

---

## Arena

The arena is a rectangular grid of hexagonal cells with a toroidal (edge wrapping) boundary. Each cell is exactly one of:

- empty
- snake segment
- spore
- food

The cells are hexagonal rather than square to avoid the problem that on a grid of square cells spores that move one cell per time step could never become adjacent if they started an even number of steps from each other (like starting on chess board squares of the same colour).

The total number of non-empty cells is conserved. Nothing disappears, only changes from one thing to another.

---

## Snake

A snake is made up of 2 or more snake segments (up to a constant maximum length).

### Movement

The first segment (the snake's head) moves from cell to cell and is followed by all the other segments. Each time step the head turns left, faces ahead, or turns right. It then attempts to move one cell forwards (the current direction of the snake).

### Eating

If the destination cell contains food and the snake is hungry, then its length increases by one cell. For this time step the head advances but the tail does not. After the timestep in which the snake's tail leaves the cell that held the food (so all of the snake segments have now passed over that cell) the snake becomes hungry again.

### Sporulation

If a snake is already at the maximum length when it eats, then its length remains the same and a spore is produced where its tail had been. The spore inherits the snake's genome with potential mutation but no crossover (only one parent). The spore is initially facing directly away from the new position of the snake's tail. The snake becomes hungry again after the timestep in which its tail leaves the cell that held the food (similarly to eating before reaching maximum length).

### Death

The snake dies if:

- the destination cell contains a snake segment or a spore
- the destination cell contains food and the snake is not hungry
- the destination cell is also the destination cell for another snake or a spore

The snake will also die with a small probability each time step.

If the snake dies then it does not move and all of its segments become food.

---

## Spore

### Movement

A spore occupies a single cell. Each time step it turns left, faces ahead, or turns right. It then attempts to move one cell forwards (the current direction of the spore).

### Combination

If a spore is adjacent to another spore then the two combine to become a snake of length 2. One of them becomes the head segment and one of them becomes the tail segment (chosen at random). If more than 2 spores are adjacent so that there is more than one way of forming a length 2 snake from them, one of the possibilities will be chosen at random.

When a snake forms it is initially hungry.

The new snake's genome is made from the 2 spore genome's using crossover, and is also subject to potential mutation.

### Death

The spore dies if:

- the destination cell contains a snake segment
- the destination cell contains food
- the destination cell is also the destination cell for another spore or a snake

The spore will also die with a small probability each time step.

If the spore dies then it does not move and it becomes food.

---

## Food

A piece of food occupies a single cell. It does not move and does not change. It remains in place until eaten by a snake.

---

## Genome

The genome contains both the genetic material and the methods of acting upon that material. This allows for running a simulation using a different genome to experiment with different ideas.

The genome is the source of the snake brain and the spore brain. It is subject to mutation and crossover when two spores combine to form a new snake.

The genome is also responsible for defining the size and type of the inputs and outputs of the snake and spore brains, so experimenting with a different size field of view or a different size or type of brain just means swapping to a different genome.

---

## Brain

A snake has a brain and a spore has a brain. Both are produced separately by the genome and give different behaviours, but they are conceptually identical.

A brain takes information about the environment plus any internal variables. It outputs a direction (left, ahead, or right), plus potentially the new values for any internal variables.

For a snake, hunger is a read only internal variable. For both snakes and spores, there may be other internal variables that can be received as input and written as output, like memory.

---

## Saving a simulation

To allow for sharing results and common starting points, a simulation can output its state in text form. This is a JSON standardised format for recording the state of an arena and all its contents so it can be run later, on a different computer, in a different implementation, potentially in a different programming language. This is defined so that different implementations do not end up insulated from each other. This also allows for implementations that do not have a graphical display but just run long term simulations very fast, to be viewed in a graphical implementation later.

    {
      genomeType: ____,
      arenaDimensions: ____,
      nonEmptyCells:
      [
        coordinates: ____,
        content: ____,
      ],
      snakes:
      [
        {
          listOfSegmentsHeadToTail:
          [
            coordinates
          ],
          hunger: ____,
          genome: ____,
          brain: ____
        }
      ],
      spores:
      [
        {
          coordinates: ____,
          genome: ____,
          brain: ____
        }
      ],
      food:
      [
        coordinates: ____
      ]
    }

The genomeType indicates a specific genome. See the readme for that genome for details of what needs to be recorded to reconstruct it, and to reconstruct individual brains, including any internal variables.
