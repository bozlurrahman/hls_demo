'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../songs');
const dist = path.join(__dirname, '../temp/chunks');

const startTime = new Date();
console.info('> Start reading files', startTime);

fs.readdir(dir, (readDirError, files) => {
	if (readDirError) {
		console.error(readDirError);

		return;
	}

	const countFiles = files.length;
	files.map(async (file, index) => { 
		const filePath = path.join(dir, file);

		const filename = file.split(".")[0];
		// const fileExtension = file.split(".")[1]
		// console.log('master', dist+"/"+filename+".m3u8");
		// console.log('single', dist+"/"+filename+"/%v/"+filename+".m3u8");

		const { err, stdout, stderr } =
			await exec(`
      ffmpeg -i ${filePath} \
      -b:a:0 128k -b:a:1 96k -b:a:2 64k -b:a:3 48k \
      -map 0:a -map 0:a -map 0:a -map 0:a -f hls \
      -var_stream_map "a:0,agroup:audio_128k,default:yes a:1,agroup:audio_96k a:2,agroup:audio_64k a:3,agroup:audio_48k" \
      -f hls -hls_time 5 -hls_list_size 0  \
      -hls_flags delete_segments+discont_start+split_by_time \
      -master_pl_name "master.m3u8" "${dist}/${filename}/%v/manifest.m3u8" -hide_banner -loglevel error`);

		if (err) {
			console.log(err);
		}

		if (countFiles - 1 === index) {
			const endTime = new Date();
			console.info('< End Preparing files', endTime);
		}
	});
});