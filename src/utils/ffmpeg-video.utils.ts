const ffmpeg = require('fluent-ffmpeg');


export const getVideoInfo = (inputPath: string) => {
  return new Promise((resolve, reject) => {
    return ffmpeg.ffprobe(inputPath, (error, videoInfo) => {
      if (error) {
        return reject(error);
      }

      const { duration, size } = videoInfo.format;

      return resolve({
        size,
        durationInSeconds: Math.floor(duration),
      });
    });
  });
};

// const takeScreenShot = ffmpeg(tempFilePath).takeScreenshots(
//   { count: 1, timemarks: ['00:00:01.000'], size: '200x200' },
//   'video/'
// )
