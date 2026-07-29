This is my personal project to train algorithms using smart cubes. It is implemented using React and Redux.

The app requires Web Bluetooth and currently only supports GAN smart cubes and others that use the same protocols (eg. Moyu 2023).
To connect a puzzle, enter its MAC address in the textbox then hit connect. You can view the state of the puzzle in the debug screen.

The trainer works with the Speffz letter scheme and trains commutators starting at UFR (letter C). The probability of cases are weighted over time.

On the technical side of things, the app uses a Redux middleware to process the events from the smart cube to store the current cube state in the Redux store.

Planned features:
- Keyboard-controlled puzzle, so I am not stuck unable to test anything when my cube is out of batteries
- Weilong AI v10 support
- ZBLL Trainer
  - I find that current trainers out there lack certain features, such as ignoring post-AUF
- Edges
