import { SongLists } from '../data/song-lists';
import { cloneDeep, findIndex } from 'lodash';
export class SongService {
  constructor() {}

  getSongsWithScore() {
    let songsStringWithScore = localStorage.getItem('songs-highscore');

    if (!songsStringWithScore) {
      const songListsWithZeroScore = cloneDeep(SongLists).map(song => ({
        ...song,
        score: 0
      }));

      songsStringWithScore = songListsWithZeroScore;
    } else {
      songsStringWithScore = JSON.parse(songsStringWithScore);
    }

    return songsStringWithScore;
  }

  setNewHighScoreSong(songName, score) {
    const songsWithScore = this.getSongsWithScore();
    const index = findIndex(songsWithScore, { name: songName });
    if (songsWithScore[index].score < score) {
      songsWithScore[index].score = score;
      this.storeSongsWithHighScore(songsWithScore);
    }
  }

  storeSongsWithHighScore(songs) {
    localStorage.setItem('songs-highscore', JSON.stringify(songs));
  }
}
