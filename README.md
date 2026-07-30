This is my personal project to train algorithms using smart cubes. It is implemented using React and Redux.

The app requires Web Bluetooth and currently only supports GAN smart cubes and others that use the same protocols (eg. Moyu 2023).
To connect a puzzle, enter its MAC address in the textbox then hit connect. You can view the state of the puzzle in the debug screen.

The trainer works with the Speffz letter scheme and trains commutators starting at UFR (letter C). The probability of cases are weighted over time.

On the technical side of things, the app uses a Redux middleware to process the events from the smart cube to store the current cube state in the Redux store.

Planned features:

- Keyboard-controlled puzzle, so I am not stuck unable to test anything when my cube is out of batteries
- Weilong AI v10 support - DONE
- ZBLL Trainer
  - I find that current trainers out there lack certain features, such as ignoring post-AUF
- Edges

## Credits

Thanks to lukeburong for providing the [documentation](https://github.com/lukeburong/weilong-v10-ai-protocol) for the protocol used by the Weilong V10 AI smartcube.

Third party licenses for external node packages can be found in [public/third-party.txt](public/third-party.txt).
The Rubik font from is licensed under the [OFL](public/rubik-ofl.txt).

## License

[MIT](LICENSE)

Code in `src/utils/encrypter.ts` is slightly modified from [the encrypter from gan-web-bluetooth](https://github.com/afedotov/gan-web-bluetooth/blob/main/src/gan-cube-encrypter.ts). As I already use this package for the GAN protocol, its license can be found in the third party license file.
