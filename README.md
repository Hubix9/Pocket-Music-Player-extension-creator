# Pocket-Music-Player-Extension-Creator
Tool created to let users of Pocket Music Player mod easily add songs



## How to use

Warning! Tool's song conversion process can be very resource demanding, I advise to close unneeded programs for the process

1. Extract Pocket Music Player Extension Creator folder from downloaded zip
2. Enter that folder
3. Put your songs in the songs folder
4. Run start.bat script
5. follow instructions given by the program on screen
6. After the process has finished you will be able to find your mod folder in the Pocket Music Player Extension Creator folder
7. Load created mod and the Pocket Music Player mod in Arma 3
8. Enjoy!


## Known Issues
* If you encounter an issue with .pbo file not being created you will have to download the "Dev" realase of this tool and package the .pbo yourself using for example **[PBO Manager](http://www.armaholic.com/page.php?id=16369)**
* After Creating Pbo, script will show you information about compression being 0% in red text, don't worry about that
* Make sure that filenames of songs don't contain special characters. Underscores, spaces, numbers and letters are ok, though it's best to keep them simple like: MySong1.mp3
* Sometimes length of some songs cannot be determined while creating extension which results in inability to play these songs inside the game

## Credits
**[FFmpeg](https://www.ffmpeg.org/)** - used to convert songs to .ogg format and to get informations about them

**[Gulp Arma Pbo plugin](https://github.com/winseros/gulp-armapbo-plugin)** - used to pack mod files into .pbo file
