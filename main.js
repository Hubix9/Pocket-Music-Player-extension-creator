//modules
const prompt = require('prompt');
const fs = require('fs');
const mkdirp = require('mkdirp');
const sleep = require('system-sleep');
const os = require('os');
const ffprobe = require('ffprobe');
const ffmpeg = require('fluent-ffmpeg');
const copy = require('copy');
const { execFile } = require('child_process');
const { exec } = require('child_process');
const rimraf = require('rimraf');
const gulp = require('gulp');
const pbo = require('gulp-armapbo');
//ffmpeg setup
ffmpeg.setFfmpegPath("./data/ffmpeg.exe");
//promptsetup
prompt.colors = false;
prompt.message = '';
//variables
var ffprobepath = './data/ffprobe.exe'
var authornickname = '';
var mainfoldername = '';
var moddescription = '';
var songfolder = './songs/';
var songs = [];
var songslenghts = [];
var songsvolumes = [];
var songdefaultvolume = 15;
//mod.cpp strings
var modcppmodname = '';
var modcppauthorname = '';
var modcppdescription = '';
var modcppdescriptionoverwiev = '';
var modcppicon = '';
var modcppactionname = '';
var modcpp = '';
var modcpppicture = '';
var modcppaction = '';
//config.cpp strings
var CfgPatches = '';
var CfgSounds = '';
var CfgVehicles = '';
var configcpp = '';
//creating addon
console.log('======Welcome to Pocket Music Player Extension Creator======')
sleep(2000)
console.log('Please enter name for your extension (make sure it\'s not including any spaces!)')
prompt.start();
prompt.get(['name'],function (err,result) {
	mainfoldername = result.name;
	mkdirp('./' + '@' + mainfoldername + '/',function(err) {
		console.log('modfolder ' + '@' + mainfoldername + ' created')
		console.log('creating mod.cpp');
		//creating mod.cpp
		modcppmodname = 'name = ' + '"' + mainfoldername + '"' + ';'
		console.log('set mod.cpp name variable to: ' + modcppmodname)
		console.log('Please enter your nickname');
		prompt.get(['name'],function(err,result) {
		authornickname = result.name;
		modcppauthorname = 'author = ' + '"' +  'Made by ' + authornickname + '"' + ';';
		console.log('set mod.cpp author variable to: ' + modcppauthorname);
		console.log('Please enter description for your extension');
		prompt.get(['description'],function(err,result) {
			moddescription = result.description;
			modcppdescription = 'tooltip = ' + '"' + moddescription + '"' + ";"
			console.log('set mod.cpp tooltip variable to: ' + modcppdescription)
			modcppdescriptionoverwiev = 'overview = ' + '"' + result.description + '"' + ";";
			console.log('set mod.cpp overview variable to: ' + modcppdescriptionoverwiev);
			modcppicon = 'logo = ' + '"' + 'radioimg.paa' + '"' + ';';
			modcpppicture = 'picture = ' + '"' + 'radioimg.paa' + '"' + ";";
			modcppactionname = 'actionName = "";'
			modcppaction = 'action = "";'
			console.log('set mod.cpp icon variable to: ' + modcppicon);
			console.log('set mod.cpp actionName variable to: ' + modcppactionname);
			console.log('set mod.cpp action variable to: ' + modcppaction);
			console.log('creating mod.cpp file');
			modcpp = modcppmodname + os.EOL + modcpppicture + os.EOL + modcppactionname + os.EOL + modcppaction + os.EOL + modcppicon + os.EOL + modcppdescription + os.EOL + modcppdescriptionoverwiev + os.EOL + modcppauthorname;
			console.log('mod.cpp created: ' + os.EOL  + modcpp);
			fs.writeFile('./' + '@' + mainfoldername + '/' + 'mod.cpp', modcpp, function(err) {
				if (err) {
					return console.log(err);
				}
				console.log('file mod.cpp written succesfully')
				console.log('creating further mod filesystem')
				console.log('creating Addons folder')
				mkdirp('./' + '@' + mainfoldername + '/' + 'Addons' + '/', function(err) {
					console.log('Addons folder created')
					console.log('creating ' + mainfoldername + ' folder');
					mkdirp('./' + '@' + mainfoldername + '/' + 'Addons' + '/' + mainfoldername + '/', function(err) {
						console.log('folder ' + mainfoldername + ' created')
						console.log('creating songs folder');
						mkdirp('./' + '@' + mainfoldername + '/' + 'Addons' + '/' + mainfoldername + '/' + 'songs' + '/', function(err) {
							console.log('folder songs created')
							console.log('gathering config.cpp data')
							fs.readdir(songfolder, function(err,files) {
								var filesproccesed = 0;
								files.forEach(function(file) {
									console.log('detected file: ' + file);
									var file_ = file.split('.');
									if (file_[1] != 'ogg') {
										console.log(file + ' is not in .ogg format, converting...')
										ffmpeg('./songs/' + file)
											.audioCodec('vorbis')
											.outputOptions('-threads 1')
											.on('end',function(err){console.log('finished converting ' + file + ' to ' + file_[0] + '.ogg');filesproccesed++})
											.save('./' + '@' + mainfoldername + '/' + 'Addons' + '/' + mainfoldername + '/' + 'songs' + '/' + file_[0] + '.ogg');
									}
									else
									{
										var filelocation = './songs/' + file;
										//console.log(filelocation);
										copy.one(filelocation,'./' + '@' + mainfoldername + '/' + 'Addons' + '/' + mainfoldername + '/', function(err,files){if (err) throw err; console.log('copied file succesfully')});
										console.log('finished copying ' + file + ' successfully');
										filesproccesed++
										//console.log(filesproccesed)
									}
										
								});
								var files2process = files.length;
								var filesproccesingfinished = false;
								var filesinfoprocessed = 0;
								function generatesoundinfo() {
									if (filesproccesed == files2process && filesproccesingfinished == false){
									files.forEach(function(file){
										ffprobe('./songs/' + file, {path: ffprobepath }, function(err,info) {
										//console.log('information about ' + file + ' file')
										//console.log(info)
										//console.log(info.streams[0].duration + ' duration of ' + file)	
										var ffmpegglobalpath = __dirname + '\\data\\ffmpeg.exe';
										var songfolderpath = __dirname + '\\' + '@' + mainfoldername + '\\' + 'Addons' + '\\' + mainfoldername + '\\' + 'songs' + '\\';
										var file_ = file.split('.')
										var songpath = songfolderpath + file_[0] + '.ogg';
										execFile(ffmpegglobalpath,['-i',songpath,'-filter:a','volumedetect','-f','null','/dev/null'],function(error,stdout,stderr) {
										//console.log(stderr);
										//console.log('position of meanvolume ' + stderr.search('mean_volume:'))
										var ffmpegoutput = stderr;
										var _ffmpegoutput = ffmpegoutput.split('mean_volume:');
										var __ffmpegoutput = _ffmpegoutput[1].split(' ');
										var ___ffmpegoutput = __ffmpegoutput[1];
										//console.log(___ffmpegoutput);
										songsvolumes.push(___ffmpegoutput);
										//console.log(songsvolumes);
										if (file_[1] != 'ogg') {
											songs.push(file_[0] + '.ogg');
										}
										else {
										songs.push(file)
										}
										//console.log(songs)
										songslenghts.push(info.streams[0].duration)
										//console.log(songslenghts)
										filesinfoprocessed++;
										//console.log(filesinfoprocessed);
										});

									});	
									});
									filesproccesingfinished = true;
									};
									
								};
								setInterval(generatesoundinfo,1000);
								var filesinfo2process = files.length;
								//console.log(files.length)
								var configcppgenerationfinished = 0;
								function generateconfigcpp() {
									if (filesinfoprocessed == filesinfo2process && configcppgenerationfinished == 0){
										console.log('generating config.cpp');
										//console.log(songs)
										cfgpatches = 'class CfgPatches' + os.EOL + '{' + os.EOL + '\t' + 'class ' + mainfoldername + os.EOL + '\t' + '{' + os.EOL + '\t' + '\t' + 'units[]={};' + os.EOL + '\t' + '\t' + 'weapons[]={};' + os.EOL + '\t' + '\t' + 'requiredAddons[]={"A3_Characters_F_BLUFOR"};' + os.EOL + '\t' + '};' + os.EOL + '};';
										CfgPatches = cfgpatches;
										var cfgsoundsstart = os.EOL + 'class CfgSounds' + os.EOL + '{' + os.EOL + '\t' + 'sounds[] = {};' + os.EOL;
										var cfgsoundsmiddlepart = '';
										var cfgsoundsend = '};';
										for (i = 0; i < songs.length; i++) {
											i_ = songs[i].split('.');
											var songvolumedb = Math.round(Number(songsvolumes[i]) * -1);
											var songvolume = '';
											//console.log('songvolumedb');
											songvolume = Math.round(songvolumedb / (3.142 - (songvolumedb * 0.042 + songvolumedb * 0.0012)));
											cfgsoundsmiddlepart += '\t' + 'class ' + i_[0].replace(/-|&|@|\[|\]|\#|\%|\*|\^|\!|\'|\"|\.|,| |\(|\)/gi, "_");
											cfgsoundsmiddlepart += os.EOL + '\t' + '\t' + '{' + os.EOL + '\t' + '\t' + '\t' + 'name = "";'
											cfgsoundsmiddlepart += os.EOL + '\t' + '\t' + '\t' + 'sound[] = {' + '"\\' + mainfoldername + '\\songs\\' + songs[i] + '"' + ',' + songvolume.toString() + ',' + '1' + ',' + '300' + '}' + ';'
											cfgsoundsmiddlepart += os.EOL + '\t' + '\t' + '\t' + 'titles[] = {};'
											cfgsoundsmiddlepart += os.EOL + '\t' + '\t' + '};'
											cfgsoundsmiddlepart += os.EOL
										};
										CfgSounds = cfgsoundsstart + cfgsoundsmiddlepart + cfgsoundsend;
										configcppgenerationfinished = 1;
										var cfgvehiclesstart = os.EOL + 'class CfgVehicles {' + os.EOL + '\tclass HubixPocketMusicPlayerObject {' + os.EOL + '\t' + '\t' + 'class ACE_Actions {' + os.EOL + '\t' + '\t' + '\t' + 'class ACE_MainActions' + os.EOL + '\t' + '\t' + '\t' + '{' + os.EOL + '\t' + '\t' + '\t' + '\t' + 'class HubixRadioSongs' + os.EOL + '\t' + '\t' + '\t' +'\t' + '{'
										var cfgvehiclesmiddlepart = '';
										var cfgvehiclesend = os.EOL + '\t' + '\t' + '\t' + '\t};' + os.EOL + '\t' + '\t' + '\t};' + os.EOL + '\t' + '\t};' + os.EOL + '\t};' + os.EOL + '};';
										var addedfiles = 0;
										var createdsubcategories = 2;
										function createnewplaysongcategory() {
											addedfiles = 0;
											cfgvehiclesmiddlepart += os.EOL + '\t' + '\t' + '\t' + '\t' + '};'
											cfgvehiclesmiddlepart += os.EOL + '\t' + '\t' + '\t' + '\t' + 'class ' + 'HubixRadioSongs' + createdsubcategories;
											cfgvehiclesmiddlepart += os.EOL + '\t' + '\t' + '\t' + '\t' + '{';
											cfgvehiclesmiddlepart += os.EOL + '\t' + '\t' + '\t' + '\t' + '\t' + 'displayName = play a song ' + createdsubcategories;
											createdsubcategories++
										}
										for (i = 0; i < songs.length; i++) {
											i_ = songs[i].split('.');
											cfgvehiclesmiddlepart += os.EOL;
											cfgvehiclesmiddlepart += '\t' + '\t' + '\t' + '\t' + '\tclass ' + i_[0].replace(/-|&|@|\[|\]|\#|\%|\*|\^|\!|\'|\"|\.|,| |\(|\)/gi, "_") + os.EOL;
											cfgvehiclesmiddlepart += '\t' + '\t' + '\t' + '\t' + '\t{' + os.EOL;
											cfgvehiclesmiddlepart += '\t' + '\t' + '\t' + '\t' + '\t' + '\tdisplayname = "' + i_[0].replace(/\"/gi, "'") + '"' + os.EOL;
											cfgvehiclesmiddlepart += '\t' + '\t' + '\t' + '\t' + '\t' + '\tsonglength = ' + Math.round(Number(songslenghts[i]) + 1) + ';' + os.EOL;
											cfgvehiclesmiddlepart += '\t' + '\t' + '\t' + '\t' + '\t' + '\tstatement = "[[' + "'" + i_[0].replace(/-|&|@|\[|\]|\#|\%|\*|\^|\!|\'|\"|\.|,| /gi, "_") + "'" + ',' + Math.round(Number(songslenghts[i]) + 1) + ',' + '200, _target], ' + "'" + '\\HubixPocketMusicPlayer\\scripts\\playradio.sqf' + "'" + '] remoteExec [\'execVM\',2]";' + os.EOL
											cfgvehiclesmiddlepart += '\t' + '\t' + '\t' + '\t' + '\t};';
											if (addedfiles == 5) createnewplaysongcategory();
											addedfiles++
										}
											cfgvehiclesmiddlepart += os.EOL + '\t' + '\t' + '\t' + '\t' + '};'
											cfgvehiclesmiddlepart += os.EOL + '\t' + '\t' + '\t' + '\t' + 'class ' + 'HubixRadioShuffleSongs';
											cfgvehiclesmiddlepart += os.EOL + '\t' + '\t' + '\t' + '\t' + '{';
											cfgvehiclesmiddlepart += os.EOL + '\t' + '\t' + '\t' + '\t' + '\t' + 'condition=false;';
											cfgvehiclesmiddlepart += os.EOL + '\t' + '\t' + '\t' + '\t' + '\t' + 'exceptions[] = {};';
											cfgvehiclesmiddlepart += os.EOL + '\t' + '\t' + '\t' + '\t' + '\t' + 'displayname = Null;';
										for (i = 0; i < songs.length; i++) {
											i_ = songs[i].split('.');
											cfgvehiclesmiddlepart += os.EOL;
											cfgvehiclesmiddlepart += '\t' + '\t' + '\t' + '\t' + '\tclass ' + i_[0].replace(/-|&|@|\[|\]|\#|\%|\*|\^|\!|\'|\"|\.|,| |\(|\)/gi, "_") + os.EOL;
											cfgvehiclesmiddlepart += '\t' + '\t' + '\t' + '\t' + '\t{' + os.EOL;
											cfgvehiclesmiddlepart += '\t' + '\t' + '\t' + '\t' + '\t' + '\tdisplayname = "' + i_[0].replace(/\"/gi, "'") + '"' + os.EOL;
											cfgvehiclesmiddlepart += '\t' + '\t' + '\t' + '\t' + '\t' + '\tsonglength = ' + Math.round(Number(songslenghts[i]) + 1) + ';' + os.EOL;
											cfgvehiclesmiddlepart += '\t' + '\t' + '\t' + '\t' + '\t' + '\tstatement = "[[' + "'" + i_[0].replace(/-|&|@|\[|\]|\#|\%|\*|\^|\!|\'|\"|\.|,| /gi, "_") + "'" + ',' + Math.round(Number(songslenghts[i]) + 1) + ',' + '200, _target], ' + "'" + '\\HubixPocketMusicPlayer\\scripts\\playradio.sqf' + "'" + '] remoteExec [\'execVM\',2]";' + os.EOL
											cfgvehiclesmiddlepart += '\t' + '\t' + '\t' + '\t' + '\t};';
										}
										CfgVehicles = cfgvehiclesstart + cfgvehiclesmiddlepart + cfgvehiclesend;
										configcpp = CfgPatches + CfgSounds + CfgVehicles;
										//console.log(configcpp)
										fs.copyFile('./data/radioimg.paa','./@' + mainfoldername + '/radioimg.paa',function(err){});
										fs.writeFile('./@' + mainfoldername + '/' + '/Addons/' + mainfoldername + '/$PBOPREFIX$.txt',mainfoldername,function(err){});
										fs.writeFile('./' + '@' + mainfoldername + '/Addons/' + '/' + mainfoldername + '/' + 'config.cpp',configcpp,function(err) {
											console.log("Creating PBO")
											//console.log('config.cpp created');
											//console.log('./data/a3lib.exe')
											//console.log('./@' + mainfoldername + '/' + 'Addons' + '/' + mainfoldername + '/')
											//fs.copyFile('./data/a3lib.exe','./@' + mainfoldername + '/' + 'Addons' + '/' + mainfoldername + '/' + 'a3lib.exe', function(err) {
												//console.log('copied a3lib.exe');
												//exec('a3lib.exe pbo -cf ' + mainfoldername + '.pbo' + ' config.cpp songs $PBOPREFIX$.txt',{cwd: __dirname + '\\@' + mainfoldername + '\\' + 'Addons' + '\\' + mainfoldername},function(error,stdout,stderr) {
													//console.log(stdout);
													//console.log(stderr);
													//console.log(error);
													//fs.copyFile('./@' + mainfoldername + '/' + 'Addons/' + mainfoldername + '/' + mainfoldername + '.pbo','./@' + mainfoldername + '/' + 'Addons/' + mainfoldername + '.pbo',function(err){
														//console.log('./@' + mainfoldername + '/' + 'Addons/' + mainfoldername + '/' + mainfoldername + '.pbo')
														//console.log('moved .pbo to ' + './@' + mainfoldername + '/' + 'Addons/' + mainfoldername + '.pbo')
											pboname = mainfoldername + ".pbo";
											gulp.src('./@' + mainfoldername + '/Addons/' + mainfoldername + '/**/*').pipe(pbo.pack({fileName: pboname})).pipe(gulp.dest('./@' + mainfoldername + '/Addons/')).on('end', function(){
											
														rimraf('./@' + mainfoldername + '/' + 'Addons/' + mainfoldername,function(err) {
															console.log('cleaned temporary files')
															//console.log('./@' + mainfoldername + '/' + 'Addons/' + mainfoldername)
															console.log('=======Finished creating your Extension!=======')
															console.log('You can find your mod in the tool\'s directory')
															console.log('you can close this window')
															console.log('window will close automatically in 10 seconds')
															sleep(10000);
															process.exit()
															})});
															
										});
									};
								};
								setInterval(generateconfigcpp,1000);
							});
						});
					});
				});
			});
		});
	});
	});
});
