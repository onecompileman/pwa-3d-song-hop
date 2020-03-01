import { GameManager } from './game/game-manager';

import './components/in-game-ui';
import './components/game-over';
import './components/pause';
import './components/about';
import './components/how-to-play';
import './components/main-menu';
import './components/song-list';
import './components/loading';

const gameManager = new GameManager();

gameManager.start();
