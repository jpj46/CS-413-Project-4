GAME_WIDTH = 500;
GAME_HEIGHT = 500;
GAME_SCALE = 2;
var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(GAME_WIDTH, 
                                       GAME_HEIGHT, 
                                       {backgroundColor: 0x330033});
gameport.appendChild(renderer.view);

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

PIXI.loader
  .add('gamefont.fnt')
  .add('assets/assets.json')
  .add('assets/map.json')
  .add('assets/tiles.png')
  
  .add('sound/Menu.mp3')
  .add('sound/Run_away.mp3')
  .add('sound/Player_attack.mp3')
  .add('sound/potion.mp3')
  .add('sound/dialogue.mp3')
  .add('sound/PlayerWinsGame.mp3')
  .add('sound/GameOver.mp3')
  .add('sound/Powerup.mp3')
  .add('sound/Shadow_King_Attack')
  .add('sound/Shadow_King_Death')
  .add('sound/Sexy_Minion_Attack')
  .add('sound/Sexy_Minion_Death')
  .add('sound/Final_Form_Attack')
  .add('sound/Final_Form_Death')
  .load(generateLevel);

var battle_stage = new PIXI.Container();
var attack_stage = new PIXI.Container();
var steal_stage = new PIXI.Container();
var item_stage = new PIXI.Container();
var battle_text_stage = new PIXI.Container();
var threat_stage = new PIXI.Container();
var player_threat_stage = new PIXI.Container();
var game_stage = new PIXI.Container();
var startScreen = new PIXI.Container();
var instructScreen = new PIXI.Container();
var creditScreen = new PIXI.Container();
var gameLoseScreen = new PIXI.Container();
var gameWinScreen = new PIXI.Container();
var back = new PIXI.Container();
var statsScreen = new PIXI.Container();
game_stage.scale.x = GAME_SCALE;
game_stage.scale.y = GAME_SCALE;

var master_stage = new PIXI.Container();
var battle_screen;
var player;
var battle_x;
var battle_y;
var temp_x;
var temp_y;
var temp_direction;
var boss_choices = false;
var enemy;
var danger_level;
var current_enemy;
var enemy2;
var enemies = [];
var hand;
var mode;
var menu_text;
var enemy_text;
var step = 10;
var count = 1;
var battle_active = false;
var dialogue_active = false;
var world;
var tu;
var npc12112_dialogue = [];
var npc4114_dialogue = [];
var npc17113_dialogue = [];
var npc22117_dialogue = [];
var npc20110_dialogue = [];
var npc27110_dialogue = [];
var npc27123_dialogue = [];
var npc33121_dialogue = [];
var npc34107_dialogue = [];
var npc43107_dialogue = [];
var npc4123_dialogue = [];
var npc40121_dialogue = [];
var npc40121X_dialogue = [];
var npc12112X_dialogue = [];
var npc174_dialogue = [];
var npc174X_dialogue = [];
var npc654_dialogue = [];
var npc654X_dialogue = [];
var npc57108_dialogue = [];
var npc65111_dialogue = [];
var npc67114_dialogue = [];
var npc63122_dialogue = [];
var npc81115_dialogue = [];
var npc90113_dialogue = [];
var npc95108_dialogue = [];
var npc94122_dialogue = [];
var npc94122X_dialogue = [];
var npc87118_dialogue = [];
var hard_enemy_dialogue = [];
var boss_enemy_dialogue = [];
var npc40121_talked_to = false;
var npc12112_talked_to = false;
var npc174_talked_to = false;
var npc654_talked_to = false;
var npc94122_talked_to = false;
var currentDialogue = 0;
var currentLine;
var currentNPC = 0;
var dialogueEnd = true;
var dialogueBox;
var dialogueText;
var playerAttackText;
var playerHealthText;
var playerArmorText;
var playerArmorArray = [];
var currentHealthSprite;
var currentArmorSprite;
var battleBackground;

var open_menu;
var run_away;
var attack;
var potion;
var dialogue;
var game_win;
var game_lose;
var power_up;
var shadow_king_start;
var shadow_king_death;
var sexy_minion_start;
var sexy_minion_death;
var final_form_start;
var final_form_death;

var dialogueText = new PIXI.Text('', 
                  {fontFamily : 'Calibri', fontSize: 25, fill : 0xFFFFFF, align : 'left'});
dialogueText.x = 5;
dialogueText.y = 405;

const PLAYERMOVEAMOUNT = 25;
const PLAYER_START_X = PLAYERMOVEAMOUNT * 2;
const PLAYER_START_Y = PLAYERMOVEAMOUNT * 106;
const FIGHT = 100;
const SKILL = 200;
const ITEM = 300;
const RUN = 400;

const RIGHT = -1;
const LEFT = -2;
const UP = -3;
const DOWN = -4;

const WKEY = 87;
const AKEY = 65;
const SKEY = 83;
const DKEY = 68;
const SPACE = 32;
const SHIFT = 16;
const ENTER = 13;
const EKEY = 69;
const QKEY = 81;

const FOREST = 1000;
const DESERT = 1001;
const SNOW = 1002;
const CAVE = 1003;

const BAT = 1;
const GOBLIN = 2;
const PIXIE = 3;
const OGRE = 4;
const EVIL_TREE = 5;
const POSSESSED_SOLDIER = 6;
const SKELETON = 7;
const SHADOW_KING = 8;
const SEXY_HENCHMAN = 9;
const DEMON_LEECH = 10;
const SNOW_DEVIL = 11;
const ICE_WRAITH = 12;
const EVIL_SNOWMAN = 13;
 
function generateLevel() 
{   
	// Initialize tile utilities
	tu = new TileUtilities( PIXI );
	world = tu.makeTiledWorld("assets/map.json", "assets/tiles.png");
	game_stage.addChild(world);
   
	collidableArray = world.getObject("Collidable").data;
    teleportArray = world.getObject("Teleport").data;
    npcArray = world.getObject("NPC").data;
	player = new Player();
	battleBackground = FOREST;
	game_stage.addChild( player.state );
	
	// Create Sound Variables
	open_menu = PIXI.audioManager.getAudio("Menu.mp3");
	run_away = PIXI.audioManager.getAudio("Run_away.mp3");
	attack = PIXI.audioManager.getAudio("Player_attack.mp3");
	potion = PIXI.audioManager.getAudio("potion.mp3");
	dialogue = PIXI.audioManager.getAudio("Dialogue.mp3");
	game_win = PIXI.audioManager.getAudio("PlayerWinsGame.mp3");
	game_lose = PIXI.audioManager.getAudio("GameOver.mp3");
	power_up = PIXI.audioManager.getAudio("Powerup.mp3");
	shadow_king_start = PIXI.audioManager.getAudio("Shadow_King_Attack.mp3");
	shadow_king_death = PIXI.audioManager.getAudio("Shadow_King_Death.mp3");
	sexy_minion_start = PIXI.audioManager.getAudio("Sexy_Minion_Attack.mp3");
	sexy_minion_death = PIXI.audioManager.getAudio("Sexy_Minion_Death.mp3");
	final_form_start = PIXI.audioManager.getAudio("Final_Form_Attack.mp3");
	final_form_death = PIXI.audioManager.getAudio("Final_Form_Death.mp3");
	
	game_stage.addChild( player.state );

	enemy = new Enemy({id: OGRE,
						num_charges: 3,
						x: 500, 
						y: 800, 
						state: createMovieClip( PLAYERMOVEAMOUNT * 20, PLAYERMOVEAMOUNT * 40,
                                          1, 1, "Overworld_Ogre", 1, 3 ), 
						name: "Ogre", 
						attack: 3, 
						speed: 2});
	/*
	enemy2 = new Enemy({id: GOBLIN,
						num_charges: 1,
						x: PLAYERMOVEAMOUNT * , 
						y: PLAYERMOVEAMOUNT * ,
						state: createMovieClip( PLAYERMOVEAMOUNT * 16, PLAYERMOVEAMOUNT * 40,
                                          1, 1, "Goblin", 1, 2 ),  
						name: "Goblin", 
						attack: 1, 
						speed: 6});*/
                  
	/*enemy2 = new Enemy({id: OGRE,
						num_charges: 3,
						x: PLAYERMOVEAMOUNT * , 
						y: PLAYERMOVEAMOUNT * , 
                  state: createMovieClip( PLAYERMOVEAMOUNT * 16, PLAYERMOVEAMOUNT * 40,
                                          1, 1, "Overworld_Ogre", 1, 3 ), 
						name: "Ogre", 
						attack: 3, 
						speed: 2});*/
                  
	/*enemy2 = new Enemy({id: PIXIE,
						num_charges: 2,
						x: PLAYERMOVEAMOUNT * , 
						y: PLAYERMOVEAMOUNT * ,
                  state: createMovieClip( PLAYERMOVEAMOUNT * 16, PLAYERMOVEAMOUNT * 40,
                                          1, 1, "Overworld_Pixie", 1, 3 ), 
						name: "Pixie", 
						attack: 2, 
						speed: 8});*/
	/*enemy2 = new Enemy({id: POSSESSED_SOLDIER,
						num_charges: 4,
						x: PLAYERMOVEAMOUNT * , 
						y: PLAYERMOVEAMOUNT * , 
                  state: createMovieClip( PLAYERMOVEAMOUNT * 16, PLAYERMOVEAMOUNT * 40,
                                          .6, .6, "Overworld_Possessed_Soldier", 1, 3 ), 
						name: "Soldier", 
						attack: 2, 
						speed: 7});*/
                  
	/*enemy2 = new Enemy({id: SKELETON,
						num_charges: 6,
						x: PLAYERMOVEAMOUNT * , 
						y: PLAYERMOVEAMOUNT * ,
                  state: createMovieClip( PLAYERMOVEAMOUNT * 16, PLAYERMOVEAMOUNT * 40,
                                          .8, .8, "Overworld_Skeleton", 1, 3 ),
						name: "Skeleton", 
						attack: 4, 
						speed: 5});*/
                  
   /** Snow enemies     					
	enemy3 = new Enemy({id: EVIL_SNOWMAN,
						num_charges: 7,
						x: PLAYERMOVEAMOUNT * 18, 
						y: PLAYERMOVEAMOUNT * 4,
						state: createMovieClip( PLAYERMOVEAMOUNT * 18, PLAYERMOVEAMOUNT * 4,
                                          1, 1, "Overworld_Evil_Snowman", 1, 3 ), 
						name: "Evil Snowman", 
						attack: 4, 
						speed: 3}); //changed for testing purposes
						
          
   enemy4 = new Enemy({id: ICE_WRAITH,
						num_charges: 5,
						x: PLAYERMOVEAMOUNT * 16, 
						y: PLAYERMOVEAMOUNT * 40,
						state: createMovieClip( PLAYERMOVEAMOUNT * 16, PLAYERMOVEAMOUNT * 40,
                                          .5, .5, "Overworld_Ice_Wraith", 1, 3 ), 
						name: "Ice Wraith", 
						attack: 3, 
						speed: 8}); //changed for testing purposes
   
   enemy5 = new Enemy({id: SNOW_DEVIL,
						num_charges: 3,
						x: PLAYERMOVEAMOUNT * 8, 
						y: PLAYERMOVEAMOUNT * 27,
						state: createMovieClip( PLAYERMOVEAMOUNT * 8, PLAYERMOVEAMOUNT * 27,
                                          1, 1, "Overworld_Snow_Devil", 1, 3 ),  
						name: "Snow Devil", 
						attack: 3, 
						speed: 6}); //changed for testing purposes */
                  
                  
   
   // ------------------------ FOREST ---------------------------------------- 
                  
	enemy2 = new Enemy({id: EVIL_TREE,
						num_charges: 5,
						x: PLAYERMOVEAMOUNT * 36, 
						y: PLAYERMOVEAMOUNT * 11, 
						state: createMovieClip( PLAYERMOVEAMOUNT * 43, PLAYERMOVEAMOUNT * 43, 
                                          1, 1, "Overworld_Evil Tree", 1, 3 ), 
						name: "Evil Tree", 
						attack: 4, 
						speed: 8});
                  
   enemy3 = new Enemy({id: OGRE,
						num_charges: 3,
						x: PLAYERMOVEAMOUNT * 18, 
						y: PLAYERMOVEAMOUNT * 4,
						state: createMovieClip( PLAYERMOVEAMOUNT * 18, PLAYERMOVEAMOUNT * 4,
                                          1, 1, "Overworld_Ogre", 1, 2 ), 
						name: "Ogre", 
						attack: 3, 
						speed: 2}); //changed for testing purposes
						
                  
   enemy4 = new Enemy({id: GOBLIN,
						num_charges: 1,
						x: PLAYERMOVEAMOUNT * 16, 
						y: PLAYERMOVEAMOUNT * 40,
						state: createMovieClip( PLAYERMOVEAMOUNT * 16, PLAYERMOVEAMOUNT * 40,
                                          1, 1, "Goblin", 1, 2 ), 
						name: "Goblin", 
						attack: 1, 
						speed: 6}); //changed for testing purposes
   
   enemy5 = new Enemy({id: GOBLIN,
						num_charges: 1,
						x: PLAYERMOVEAMOUNT * 8, 
						y: PLAYERMOVEAMOUNT * 27,
						state: createMovieClip( PLAYERMOVEAMOUNT * 8, PLAYERMOVEAMOUNT * 27,
                                          1, 1, "Goblin", 1, 2 ),  
						name: "Goblin", 
						attack: 3, 
						speed: 2}); //changed for testing purposes 
	
   
   // ------------------------ FOREST ---------------------------------------- 
   
   
   // ------------------------ CAVE ---------------------------------------- 
   
   enemy6 = new Enemy({id: SHADOW_KING,
						num_charges: 8,
						x: PLAYERMOVEAMOUNT * 96, 
						y: ((PLAYERMOVEAMOUNT * 58) + 10),
						state: createMovieClip( PLAYERMOVEAMOUNT * 96, ((PLAYERMOVEAMOUNT * 58) + 5),
                                          1, 1, "Overworld_Shadow_King", 1, 5 ), 
						name: "Shadow King", 
						attack: 4, 
						speed: 6});
                  
   enemy7 = new Enemy({id: SEXY_HENCHMAN,
						num_charges: 9,
						x: PLAYERMOVEAMOUNT * 97, 
						y: ((PLAYERMOVEAMOUNT * 56) - 10),
                  state: createMovieClip( PLAYERMOVEAMOUNT * 97, PLAYERMOVEAMOUNT * 56,
                                          1, 1, "Overworld_Sexy_Henchman", 1, 5 ), 
						name: "Sexy Henchman", 
						attack: 5, 
						speed: 3});
   
   enemy8 = new Enemy({id: DEMON_LEECH,
						num_charges: 10,
						x: PLAYERMOVEAMOUNT * 80, 
						y: PLAYERMOVEAMOUNT * 80,
                  state: createMovieClip( PLAYERMOVEAMOUNT * 80, PLAYERMOVEAMOUNT * 80,
                                          1, 1, "Demon Leech", 1, 3 ), 
						name: "Demon Leech", 
						attack: 6, 
						speed: 5});
   
   enemy27 = new Enemy({id: SKELETON,
						num_charges: 6,
						x: PLAYERMOVEAMOUNT * 78, 
						y: PLAYERMOVEAMOUNT * 64,
                  state: createMovieClip( PLAYERMOVEAMOUNT * 78, PLAYERMOVEAMOUNT * 64,
                                          .8, .8, "Overworld_Skeleton", 1, 3 ),
						name: "Skeleton", 
						attack: 4, 
						speed: 5});
   
   enemy28 = new Enemy({id: SKELETON,
						num_charges: 6,
						x: PLAYERMOVEAMOUNT * 81, 
						y: PLAYERMOVEAMOUNT * 93,
                  state: createMovieClip( PLAYERMOVEAMOUNT * 81, PLAYERMOVEAMOUNT * 93,
                                          .8, .8, "Overworld_Skeleton", 1, 3 ),
						name: "Skeleton", 
						attack: 4, 
						speed: 5});
   
   enemy29 = new Enemy({id: BAT,
                        num_charges: 4,
                        x: PLAYERMOVEAMOUNT * 64, 
                        y: PLAYERMOVEAMOUNT * 83, 
                  state: createMovieClip( PLAYERMOVEAMOUNT * 64, PLAYERMOVEAMOUNT * 83,
                                          .6, .6, "Bat", 1, 3 ), 
                        name: "Bat", 
                        attack: 4, 
                        speed: 8});
   
   enemy30 = new Enemy({id: BAT,
                        num_charges: 4,
                        x: PLAYERMOVEAMOUNT * 66, 
                        y: PLAYERMOVEAMOUNT * 76, 
                  state: createMovieClip( PLAYERMOVEAMOUNT * 66, PLAYERMOVEAMOUNT * 76,
                                          .6, .6, "Bat", 1, 3 ), 
                        name: "Bat", 
                        attack: 4, 
                        speed: 8});
   
   enemy31 = new Enemy({id: BAT,
                        num_charges: 3,
                        x: PLAYERMOVEAMOUNT * 59, 
                        y: PLAYERMOVEAMOUNT * 61, 
                  state: createMovieClip( PLAYERMOVEAMOUNT * 59, PLAYERMOVEAMOUNT * 61,
                                          .6, .6, "Bat", 1, 3 ), 
                        name: "Bat", 
                        attack: 3, 
                        speed: 2});
   
   enemy32 = new Enemy({id: BAT,
                        num_charges: 4,
                        x: PLAYERMOVEAMOUNT * 88, 
                        y: PLAYERMOVEAMOUNT * 68, 
                  state: createMovieClip( PLAYERMOVEAMOUNT * 88, PLAYERMOVEAMOUNT * 68,
                                          .6, .6, "Bat", 1, 3 ), 
                        name: "Bat", 
                        attack: 4, 
                        speed: 8});
   
   enemy33 = new Enemy({id: BAT,
                        num_charges: 4,
                        x: PLAYERMOVEAMOUNT * 79, 
                        y: PLAYERMOVEAMOUNT * 78, 
                  state: createMovieClip( PLAYERMOVEAMOUNT * 79, PLAYERMOVEAMOUNT * 78,
                                          .6, .6, "Bat", 1, 3 ), 
                        name: "Bat", 
                        attack: 4, 
                        speed: 8});
   
   // ------------------------ CAVE ---------------------------------------- 
   
   
   // ------------------------ FOREST ---------------------------------------- 
   
   enemy9 = new Enemy({id: PIXIE,
						num_charges: 2,
						x: PLAYERMOVEAMOUNT * 39, 
						y: PLAYERMOVEAMOUNT * 4,
                  state: createMovieClip( PLAYERMOVEAMOUNT * 39, PLAYERMOVEAMOUNT * 4,
                                          1, 1, "Overworld_Pixie", 1, 3 ), 
						name: "Pixie", 
						attack: 2, 
						speed: 8});
   
   enemy10 = new Enemy({id: PIXIE,
						num_charges: 2,
						x: PLAYERMOVEAMOUNT * 30, 
						y: PLAYERMOVEAMOUNT * 33,
                  state: createMovieClip( PLAYERMOVEAMOUNT * 30, PLAYERMOVEAMOUNT * 23,
                                          1, 1, "Overworld_Pixie", 1, 3 ), 
						name: "Pixie", 
						attack: 2, 
						speed: 8});
                  
   enemy11 = new Enemy({id: PIXIE,
						num_charges: 2,
						x: PLAYERMOVEAMOUNT * 7, 
						y: PLAYERMOVEAMOUNT * 11,
                  state: createMovieClip( PLAYERMOVEAMOUNT * 7, PLAYERMOVEAMOUNT * 11,
                                          1, 1, "Overworld_Pixie", 1, 3 ), 
						name: "Pixie", 
						attack: 2, 
						speed: 8});
   
   enemy12 = new Enemy({id: PIXIE,
						num_charges: 2,
						x: PLAYERMOVEAMOUNT * 44, 
						y: PLAYERMOVEAMOUNT * 31,
                  state: createMovieClip( PLAYERMOVEAMOUNT * 44, PLAYERMOVEAMOUNT * 31,
                                          1, 1, "Overworld_Pixie", 1, 3 ), 
						name: "Pixie", 
						attack: 2, 
						speed: 8});
                  
   // ------------------------ FOREST ----------------------------------------
   
               
                  
   // ------------------------ DESERT ----------------------------------------               
                  
   enemy14 = new Enemy({id: POSSESSED_SOLDIER,
						num_charges: 4,
						x: PLAYERMOVEAMOUNT * 61, 
						y: PLAYERMOVEAMOUNT * 40, 
                  state: createMovieClip( PLAYERMOVEAMOUNT * 61, PLAYERMOVEAMOUNT * 40,
                                          .6, .6, "Overworld_Possessed_Soldier", 1, 3 ), 
						name: "Soldier", 
						attack: 2, 
						speed: 7});
   
   enemy15 = new Enemy({id: POSSESSED_SOLDIER,
						num_charges: 4,
						x: PLAYERMOVEAMOUNT * 65, 
						y: PLAYERMOVEAMOUNT * 19, 
                  state: createMovieClip( PLAYERMOVEAMOUNT * 65, PLAYERMOVEAMOUNT * 19,
                                          .6, .6, "Overworld_Possessed_Soldier", 1, 3 ), 
						name: "Soldier", 
						attack: 2, 
						speed: 7});
   
   enemy16 = new Enemy({id: POSSESSED_SOLDIER,
						num_charges: 4,
						x: PLAYERMOVEAMOUNT * 87, 
						y: PLAYERMOVEAMOUNT * 17, 
                  state: createMovieClip( PLAYERMOVEAMOUNT * 87, PLAYERMOVEAMOUNT * 17,
                                          .6, .6, "Overworld_Possessed_Soldier", 1, 3 ), 
						name: "Soldier", 
						attack: 2, 
						speed: 7});
   
   enemy17 = new Enemy({id: POSSESSED_SOLDIER,
						num_charges: 4,
						x: PLAYERMOVEAMOUNT * 66, 
						y: PLAYERMOVEAMOUNT * 5, 
                  state: createMovieClip( PLAYERMOVEAMOUNT * 66, PLAYERMOVEAMOUNT * 5,
                                          .6, .6, "Overworld_Possessed_Soldier", 1, 3 ), 
						name: "Soldier", 
						attack: 2, 
						speed: 7});
   
   enemy18 = new Enemy({id: POSSESSED_SOLDIER,
						num_charges: 4,
						x: PLAYERMOVEAMOUNT * 94, 
						y: PLAYERMOVEAMOUNT * 5, 
                  state: createMovieClip( PLAYERMOVEAMOUNT * 94, PLAYERMOVEAMOUNT * 5,
                                          .6, .6, "Overworld_Possessed_Soldier", 1, 3 ), 
						name: "Soldier", 
						attack: 2, 
						speed: 7});
                  
   // ------------------------ DESERT ----------------------------------------
   
   
   
   // ------------------------ ICE ----------------------------------------
   enemy19 = new Enemy({id: ICE_WRAITH,
						num_charges: 5,
						x: PLAYERMOVEAMOUNT * 10, 
						y: PLAYERMOVEAMOUNT * 87,
						state: createMovieClip( PLAYERMOVEAMOUNT * 10, PLAYERMOVEAMOUNT * 87,
                                          .5, .5, "Overworld_Ice_Wraith", 1, 3 ), 
						name: "Ice Wraith", 
						attack: 3, 
						speed: 8});
   
   enemy20 = new Enemy({id: ICE_WRAITH,
						num_charges: 5,
						x: PLAYERMOVEAMOUNT * 7, 
						y: PLAYERMOVEAMOUNT * 65,
						state: createMovieClip( PLAYERMOVEAMOUNT * 7, PLAYERMOVEAMOUNT * 65,
                                          .5, .5, "Overworld_Ice_Wraith", 1, 3 ), 
						name: "Ice Wraith", 
						attack: 3, 
						speed: 8});
   
   enemy21 = new Enemy({id: ICE_WRAITH,
						num_charges: 5,
						x: PLAYERMOVEAMOUNT * 39, 
						y: PLAYERMOVEAMOUNT * 88,
						state: createMovieClip( PLAYERMOVEAMOUNT * 39, PLAYERMOVEAMOUNT * 88,
                                          .5, .5, "Overworld_Ice_Wraith", 1, 3 ), 
						name: "Ice Wraith", 
						attack: 3, 
						speed: 8});
   
   enemy22 = new Enemy({id: SNOW_DEVIL,
						num_charges: 3,
						x: PLAYERMOVEAMOUNT * 16, 
						y: PLAYERMOVEAMOUNT * 90,
						state: createMovieClip( PLAYERMOVEAMOUNT * 16, PLAYERMOVEAMOUNT * 90,
                                          1, 1, "Overworld_Snow_Devil", 1, 3 ),  
						name: "Snow Devil", 
						attack: 3, 
						speed: 6});
   
   enemy23 = new Enemy({id: SNOW_DEVIL,
						num_charges: 3,
						x: PLAYERMOVEAMOUNT * 20, 
						y: PLAYERMOVEAMOUNT * 69,
						state: createMovieClip( PLAYERMOVEAMOUNT * 20, PLAYERMOVEAMOUNT * 69,
                                          1, 1, "Overworld_Snow_Devil", 1, 3 ),  
						name: "Snow Devil", 
						attack: 3, 
						speed: 6});
   
   enemy24 = new Enemy({id: SNOW_DEVIL,
						num_charges: 3,
						x: PLAYERMOVEAMOUNT * 29, 
						y: PLAYERMOVEAMOUNT * 78,
						state: createMovieClip( PLAYERMOVEAMOUNT * 29, PLAYERMOVEAMOUNT * 78,
                                          1, 1, "Overworld_Snow_Devil", 1, 3 ),  
						name: "Snow Devil", 
						attack: 3, 
						speed: 6});
   
   enemy25 = new Enemy({id: SNOW_DEVIL,
						num_charges: 3,
						x: PLAYERMOVEAMOUNT * 24, 
						y: PLAYERMOVEAMOUNT * 74,
						state: createMovieClip( PLAYERMOVEAMOUNT * 24, PLAYERMOVEAMOUNT * 74,
                                          1, 1, "Overworld_Snow_Devil", 1, 3 ),  
						name: "Snow Devil", 
						attack: 3, 
						speed: 6});
   
   enemy26 = new Enemy({id: SNOW_DEVIL,
						num_charges: 3,
						x: PLAYERMOVEAMOUNT * 34, 
						y: PLAYERMOVEAMOUNT * 63,
						state: createMovieClip( PLAYERMOVEAMOUNT * 34, PLAYERMOVEAMOUNT * 63,
                                          1, 1, "Overworld_Snow_Devil", 1, 3 ),  
						name: "Snow Devil", 
						attack: 3, 
						speed: 6});
    
   enemy13 = new Enemy({id: EVIL_SNOWMAN,
						num_charges: 7,
						x: PLAYERMOVEAMOUNT * 43, 
						y: PLAYERMOVEAMOUNT * 57,
						state: createMovieClip( PLAYERMOVEAMOUNT * 43, PLAYERMOVEAMOUNT * 57,
                                          1, 1, "Overworld_Evil_Snowman", 1, 3 ), 
						name: "Evil Snowman", 
						attack: 4, 
						speed: 3});
   // ------------------------ ICE ----------------------------------------
   
   
   
   
		
	enemies.push( enemy );
	enemies.push( enemy2 );
	enemies.push( enemy3 );
	enemies.push( enemy4 );
	enemies.push( enemy5 );
	enemies.push( enemy6 );
	enemies.push( enemy7 );
	enemies.push( enemy8 );
	enemies.push( enemy9 );
   enemies.push( enemy10 );
   enemies.push( enemy11 );
   enemies.push( enemy12 );
   enemies.push( enemy13 );
   enemies.push( enemy14 );
   enemies.push( enemy15 );
   enemies.push( enemy16 );
   enemies.push( enemy17 );
   enemies.push( enemy18 );
   enemies.push( enemy19 );
   enemies.push( enemy20 );
   enemies.push( enemy21 );
   enemies.push( enemy22 );
   enemies.push( enemy23 );
   enemies.push( enemy24 );
   enemies.push( enemy25 );
   enemies.push( enemy26 );
   enemies.push( enemy27 );
   enemies.push( enemy28 );
   enemies.push( enemy29 );
   enemies.push( enemy30 );
   enemies.push( enemy31 );
   enemies.push( enemy32 );
   enemies.push( enemy33 );

   
   /** For later enemies
   enemies.push( enemy34 );
   enemies.push( enemy35 );
   enemies.push( enemy36 );
   enemies.push( enemy37 );
   enemies.push( enemy38 );
   enemies.push( enemy39 );
   enemies.push( enemy40 );
   enemies.push( enemy41 );
   enemies.push( enemy42 );
   enemies.push( enemy43 );
   enemies.push( enemy44 );
   enemies.push( enemy45 );
   enemies.push( enemy46 );
   enemies.push( enemy47 );
   enemies.push( enemy48 );
   enemies.push( enemy49 );
   enemies.push( enemy50 );
   enemies.push( enemy51 );
   enemies.push( enemy52 );
   enemies.push( enemy53 );
   enemies.push( enemy54 );
   enemies.push( enemy55 );
   enemies.push( enemy56 );
   enemies.push( enemy57 );
   enemies.push( enemy58 );
   enemies.push( enemy59 );
   enemies.push( enemy60 );
   enemies.push( enemy61 );
   enemies.push( enemy62 );
   enemies.push( enemy63 );
   enemies.push( enemy64 );
   enemies.push( enemy65 );
   enemies.push( enemy66 );
   enemies.push( enemy67 );
   enemies.push( enemy68 );
   enemies.push( enemy69 );
   enemies.push( enemy70 );
   enemies.push( enemy71 );
   enemies.push( enemy72 );
   enemies.push( enemy73 );
   enemies.push( enemy74 );
   enemies.push( enemy75 );
   enemies.push( enemy76 );
   enemies.push( enemy77 );
   enemies.push( enemy78 );
   enemies.push( enemy79 );
   enemies.push( enemy80 );
   enemies.push( enemy81 );
   enemies.push( enemy82 );
   enemies.push( enemy83 );
   enemies.push( enemy84 );
   enemies.push( enemy85 );
   enemies.push( enemy86 );
   enemies.push( enemy87 );
   enemies.push( enemy88 );
   enemies.push( enemy89 );
   enemies.push( enemy90 );
   enemies.push( enemy91 );
   enemies.push( enemy92 );
   enemies.push( enemy93 );
   enemies.push( enemy94 );
   enemies.push( enemy95 );
   enemies.push( enemy96 );
   enemies.push( enemy97 );
   enemies.push( enemy98 );
   enemies.push( enemy99 );
   */
   
   
   initialize_npc_dialogue();
	
	game_stage.addChild( enemy.state );
	game_stage.addChild( enemy2.state );
   game_stage.addChild( enemy3.state );
	game_stage.addChild( enemy4.state );
   game_stage.addChild( enemy5.state );
	game_stage.addChild( enemy6.state );
   game_stage.addChild( enemy7.state );
   //game_stage.addChild( enemy8.state );
	game_stage.addChild( enemy9.state );
   game_stage.addChild( enemy10.state );
   game_stage.addChild( enemy11.state );
   game_stage.addChild( enemy12.state );
   game_stage.addChild( enemy13.state );
   game_stage.addChild( enemy14.state );
   game_stage.addChild( enemy15.state );
   game_stage.addChild( enemy16.state );
   game_stage.addChild( enemy17.state );
   game_stage.addChild( enemy18.state );
   game_stage.addChild( enemy19.state );
   game_stage.addChild( enemy20.state );
   game_stage.addChild( enemy21.state );
   game_stage.addChild( enemy22.state );
   game_stage.addChild( enemy23.state );
   game_stage.addChild( enemy24.state );
   game_stage.addChild( enemy25.state );
   game_stage.addChild( enemy26.state );
   game_stage.addChild( enemy27.state );
   game_stage.addChild( enemy28.state );
   game_stage.addChild( enemy29.state );
   game_stage.addChild( enemy30.state );
   game_stage.addChild( enemy31.state );
   game_stage.addChild( enemy32.state );
   game_stage.addChild( enemy33.state );
   
   /** For later enemies
   game_stage.addChild( enemy34.state );
   game_stage.addChild( enemy35.state );
   game_stage.addChild( enemy36.state );
   game_stage.addChild( enemy37.state );
   game_stage.addChild( enemy38.state );
   game_stage.addChild( enemy39.state );
   game_stage.addChild( enemy40.state );
   game_stage.addChild( enemy41.state );
   game_stage.addChild( enemy42.state );
   game_stage.addChild( enemy43.state );
   game_stage.addChild( enemy44.state );
   game_stage.addChild( enemy45.state );
   game_stage.addChild( enemy46.state );
   game_stage.addChild( enemy47.state );
   game_stage.addChild( enemy48.state );
   game_stage.addChild( enemy49.state );
   game_stage.addChild( enemy50.state );
   game_stage.addChild( enemy51.state );
   game_stage.addChild( enemy52.state );
   game_stage.addChild( enemy53.state );
   game_stage.addChild( enemy54.state );
   game_stage.addChild( enemy55.state );
   game_stage.addChild( enemy56.state );
   game_stage.addChild( enemy57.state );
   game_stage.addChild( enemy58.state );
   game_stage.addChild( enemy59.state );
   game_stage.addChild( enemy60.state );
   game_stage.addChild( enemy61.state );
   game_stage.addChild( enemy62.state );
   game_stage.addChild( enemy63.state );
   game_stage.addChild( enemy64.state );
   game_stage.addChild( enemy65.state );
   game_stage.addChild( enemy66.state );
   game_stage.addChild( enemy67.state );
   game_stage.addChild( enemy68.state );
   game_stage.addChild( enemy69.state );
   game_stage.addChild( enemy70.state );
   game_stage.addChild( enemy71.state );
   game_stage.addChild( enemy72.state );
   game_stage.addChild( enemy73.state );
   game_stage.addChild( enemy74.state );
   game_stage.addChild( enemy75.state );
   game_stage.addChild( enemy76.state );
   game_stage.addChild( enemy77.state );
   game_stage.addChild( enemy78.state );
   game_stage.addChild( enemy79.state );
   game_stage.addChild( enemy80.state );
   game_stage.addChild( enemy81.state );
   game_stage.addChild( enemy82.state );
   game_stage.addChild( enemy83.state );
   game_stage.addChild( enemy84.state );
   game_stage.addChild( enemy85.state );
   game_stage.addChild( enemy86.state );
   game_stage.addChild( enemy87.state );
   game_stage.addChild( enemy88.state );
   game_stage.addChild( enemy89.state );
   game_stage.addChild( enemy90.state );
   game_stage.addChild( enemy91.state );
   game_stage.addChild( enemy92.state );
   game_stage.addChild( enemy93.state );
   game_stage.addChild( enemy94.state );
   game_stage.addChild( enemy95.state );
   game_stage.addChild( enemy96.state );
   game_stage.addChild( enemy97.state );
   game_stage.addChild( enemy98.state );
   game_stage.addChild( enemy99.state );
   */
   
	document.addEventListener('keydown', keydownEventHandler);
	
	master_stage.addChild(game_stage);
   buildScreens();
   
   game_stage.visible = false;
	
	update();
}

function generateBattleMenu() 
{
   if ( player.is_alive ) 
   {
      battle_stage = new PIXI.Container();
	   battle_text_stage = new PIXI.Container();
      battle_active = true;
      battle_text_stage.scale.x = 1.5;
      battle_text_stage.scale.y = 1.5;
      mode = RUN;
	  
	  statsScreen.visible = false; 
      statsScreen.removeChild( currentHealthSprite );
      statsScreen.removeChild( currentArmorSprite );
	  
	  switch ( battleBackground ) {
		case FOREST:
			battle_screen = new PIXI.Sprite(PIXI.Texture.fromImage("battle_menu_forest.png"));
			break;
		case DESERT:
		    battle_screen = new PIXI.Sprite(PIXI.Texture.fromImage("battle_menu_desert.png"));
			break;
		case SNOW:
		    battle_screen = new PIXI.Sprite(PIXI.Texture.fromImage("battle_menu_ice.png"));
			break;
		case CAVE:
		    battle_screen = new PIXI.Sprite(PIXI.Texture.fromImage("battle_menu_cave.png"));
			break;
	  }
	  
	  battle_stage.addChild( battle_screen );
      
      if ( menu_text != null ) 
      {
         delete menu_text;
      }

      menu_text = new PIXI.extras.BitmapText("fight\nskill\nheal\nrun", {font: "16px gamefont"});
      menu_text.position.x = 105;
      menu_text.position.y = 250;
	  battle_text_stage.addChild( menu_text );
	  

	  battle_text_stage.addChild( player.text );
	  
	  temp_x = player.state.position.x;
	  temp_y = player.state.position.y;
	  temp_direction = player.direction;
	  
	  swapPlayer( 100, 200, 5, 5, "PlayerRight", 1, 3 );
	  
	  battle_stage.addChild( player.state );
	  
	  
	  current_enemy = checkTarget();
	  current_enemy.visible = true;
	  enemy_text = new PIXI.extras.BitmapText(current_enemy.name, {font: "16px gamefont"});
	  enemy_text.position.x = 250;
	  enemy_text.position.y = 250;
	  battle_text_stage.addChild( enemy_text );
	  battle_stage.addChild(current_enemy.health_meter);
	  
	  /* Compendium */
	  
	  switch ( current_enemy.id ) {
			case GOBLIN:
				current_enemy.state = createMovieClip( 250, 200, 5, 5, current_enemy.name, 1, 2 );
				break;
			case OGRE:
				current_enemy.state = createMovieClip( 215, 125, 2, 2, current_enemy.name, 1, 3 );
				break;
			case PIXIE:
				current_enemy.state = createMovieClip( 250, 200, 1, 1, current_enemy.name, 1, 5 );
				current_enemy.state.animationSpeed = 0.25;
				break;
			case POSSESSED_SOLDIER:
				current_enemy.state = createMovieClip( 240, 175, 2, 2, current_enemy.name, 1, 3 );
				break;
			case SKELETON:
				enemy_text.position.x -= 10;
				current_enemy.state = createMovieClip( 250, 135, 1.25, 1.25, current_enemy.name, 1, 3 );
				break;
			case BAT:
				enemy_text.position.x += 25;
				current_enemy.state = createMovieClip( 225, 150, 2, 2, current_enemy.name, 1, 7 );
				current_enemy.state.animationSpeed = 0.25;
				break;
			case EVIL_TREE:
				enemy_text.position.x -= 10;
				current_enemy.state = createMovieClip( 205, 75, 1, 1, current_enemy.name, 1, 3 );
				break;
			case SNOW_DEVIL:
				enemy_text.position.x -= 40;
				current_enemy.state = createMovieClip( 260, 215, 1, 1, current_enemy.name, 1, 3 );
				break;
			case ICE_WRAITH:
				enemy_text.position.x -= 25;
				current_enemy.state = createMovieClip( 225, 125, 1, 1, current_enemy.name, 1, 3 );
				break;
			case EVIL_SNOWMAN:
				enemy_text.position.x -= 65;
				current_enemy.state = createMovieClip( 250, 125, 2, 2, current_enemy.name, 1, 3 );
				break;
			case SHADOW_KING:
			    //Shadow_King_Attack.play();
				enemy_text.position.x -= 50;
				current_enemy.state = createMovieClip( 225, 10, 2, 2, current_enemy.name, 1, 5 );
				break;
			case SEXY_HENCHMAN:
				//Sexy_Minion_Attack.play();
				enemy_text.position.x -= 75;
				current_enemy.state = createMovieClip( 250, 150, 1, 1, current_enemy.name, 1, 5 );
				break;
			case DEMON_LEECH:
			    //Final_Form_Attack.play();
				enemy_text.position.x -= 50;
				player.state.position.x -= 60;
				current_enemy.state = createMovieClip( 150, -10, 1.5, 1.5, current_enemy.name, 1, 5 );
				break;
	  }
	  
	  battle_stage.addChild( current_enemy.state );
	  battle_stage.addChild( threat_stage );
	  battle_stage.addChild( player_threat_stage );

      if ( hand != null ) 
      {
         delete hand;
      }

      hand = new PIXI.Sprite(PIXI.Texture.fromImage("hand.png"));
      hand.position.x = menu_text.position.x - 20;
      hand.position.y = menu_text.position.y + menu_text.height - 10;

	  
      battle_text_stage.addChild( hand );
	   battle_stage.addChild( battle_text_stage );
      master_stage.addChild( battle_stage );
   }
}

function update() 
{
    requestAnimationFrame( update );
	update_camera();
	if ( battle_active ) { 
		player.updateHealthBar();
		current_enemy.updateHealthBar();
		renderer.render( battle_stage ); }
	else { 
	renderer.render( master_stage ); }
}

/**
 * checks for collision of two objects using there rectangle dimensions
 * @param {*} object a PIXi.Container Object of subclass
 * @param {*} otherObject a PIXi.Container Object of subclass
 * @returns true if there is collisoin; false if otherwise
 */
function checkRectangleCollision( object, otherObject ){

	let collision = false, combinedHalfWidths, xVector, yVector

	//Find the center points of each sprite
	object.centerX = object.x +  object.width / 2;
	object.centerY = object.y + object.height / 2;

	otherObject.centerX = otherObject.x + otherObject.width / 2;
	otherObject.centerY = otherObject.y + otherObject.height / 2;

	//finding half widths and half heights
	object.halfWidth = object.width / 2;
  	object.halfHeight = object.height / 2;
  	otherObject.halfWidth = otherObject.width / 2;
	otherObject.halfHeight = otherObject.height / 2;

	//Calculate the distance vector between the sprites
	xVector = object.centerX - otherObject.centerX;
	yVector = object.centerY - otherObject.centerY;

	//Figure out the combined half-widths(with a more leaniate threshold for gameplay)
	//and half-heights
  	combinedHalfWidthsAdjusted = object.halfWidth + otherObject.halfWidth - 20;
  	combinedHalfHeights = object.halfHeight + otherObject.halfHeight;

	//Check for a collision on the x axis
	if (Math.abs(xVector) < (combinedHalfWidthsAdjusted) && Math.abs(yVector) < combinedHalfHeights) {
		collision = true;	
	}

	return collision;
}

/**
 * checks every collision with every skull to see if it collides with the player
 * using checkRectangleCollision function
 */
function checkEnemyPlayerCollisions(){

	for(var i in enemies){
		var foe = enemies[i];
		if(checkRectangleCollision(player.state, foe.state)){
			if ( foe.id != DEMON_LEECH ) {
			foe.is_hit = true;
			
			if ( foe.id != SEXY_HENCHMAN ) {
				foe.state.visible = false;
				game_stage.removeChild(foe);
			}
			
			return true;
			}
		}
	}

	return false;
}

function moveHand(x, y) {
  if (!hand) return;
  createjs.Tween.removeTweens(hand.position);
  createjs.Tween.get(hand.position).to({ x: x, y: y}, 100, createjs.Ease.bounceOut);
}

var menu = StateMachine.create({
  initial: {state: 'run', event: 'init'},
  error: function() {},
  events: [
    {name: "down", from: "fight", to: "skill"}, //fight->magic
    //{name: "down", from: "magic", to: "steal"},
    {name: "down", from: "skill", to: "item"},
    {name: "down", from: "item", to: "run"},
    {name: "down", from: "run", to: "run"},
    
    {name: "up", from: "fight", to: "fight"},
    //{name: "up", from: "magic", to: "fight"},
    {name: "up", from: "skill", to: "fight"}, //skill->magic
    {name: "up", from: "item", to: "skill"},
    {name: "up", from: "run", to: "item"}

  ],
  callbacks: {
    onfight: function() { moveHand(hand.position.x, menu_text.position.y + 
                           menu_text.height - 70); mode = FIGHT;},
    //onmagic: function() { moveHand(hand.position.x, player.position.y - 105); mode = 2; },
    onskill: function() { moveHand(hand.position.x, menu_text.position.y + 
                           menu_text.height - 50); mode = SKILL;},
    onitem: function() { moveHand(hand.position.x, menu_text.position.y + 
                           menu_text.height - 30); mode = ITEM;},
    onrun: function() { moveHand(hand.position.x, menu_text.position.y + 
                           menu_text.height - 10); mode = RUN;}
  }
});

// ---------- Input handlers
function keydownEventHandler(event) {
   if( !game_stage.visible )
   {
      player.state.position.x = PLAYER_START_X;
      player.state.position.y = PLAYER_START_Y;
   }
   
   else if ( player.is_alive ) 
   {
      if ( !battle_active && !dialogue_active ) 
      {
      
         // Vertical --------------------------------------------------
         if ( event.keyCode == WKEY )
         {
            // Update the player sprite to upper facing player
            player.state.position.y -= PLAYERMOVEAMOUNT;
            swapPlayer( player.state.position.x, player.state.position.y, 1, 1, "PlayerUp", 1, 3  );
            player.direction = UP;
            
            collide = tu.hitTestTile(player.state, collidableArray, 0, world, "every");
            teleport = tu.hitTestTile(player.state, teleportArray, 0, world, "every");
            npc = tu.hitTestTile(player.state, npcArray, 0, world, "every");
            
            // Does player try to move to tile they shouldn't?
            if( !collide.hit || !npc.hit )
            {
               player.state.position.y += PLAYERMOVEAMOUNT;
            }
            
            // Does player transition to new area?
            if( !teleport.hit )
            {
               teleportPlayer( teleport.index );
            }
            
            // Does player encounter enemy?
            if( checkEnemyPlayerCollisions() )
            {
               if ( count == 1 ) 
               {
                  player.state.position.y += PLAYERMOVEAMOUNT;
                  generateBattleMenu( checkTarget() );
                  //alert("" + player.position.x);
                  count--;
               }
            }
         }
         
         else if ( event.keyCode == SKEY ) 
         {
            // Update the player sprite to lower facing player
            player.state.position.y += PLAYERMOVEAMOUNT;
            swapPlayer( player.state.position.x, player.state.position.y, 1, 1, "PlayerDown", 1, 3  );
            player.direction = DOWN;
            
            collide = tu.hitTestTile(player.state, collidableArray, 0, world, "every");
            teleport = tu.hitTestTile(player.state, teleportArray, 0, world, "every");
            npc = tu.hitTestTile(player.state, npcArray, 0, world, "every");
            
            // Does player try to move to tile they shouldn't?
            if( !collide.hit || !npc.hit )
            {
               player.state.position.y -= PLAYERMOVEAMOUNT;
            }
            
            // Does player transition to new area?
            if( !teleport.hit )
            {
               teleportPlayer( teleport.index );
            }
            
            // Does player encounter enemy?
            if( checkEnemyPlayerCollisions() )
            {
               if ( count == 1 ) 
               {
                  player.state.position.y -= PLAYERMOVEAMOUNT;
                  generateBattleMenu();
                  //alert("" + player.position.x);
                  count--;
               }
            }
         }

         // Horizontal --------------------------------------------------
         else if ( event.keyCode == AKEY ) 
         {
            // Update the player sprite to left facing player
			player.state.position.x -= PLAYERMOVEAMOUNT;
            swapPlayer( player.state.position.x, player.state.position.y, 1, 1, "PlayerLeft", 1, 3  );
            player.direction = LEFT;
            
            collide = tu.hitTestTile(player.state, collidableArray, 0, world, "every");
            teleport = tu.hitTestTile(player.state, teleportArray, 0, world, "every");
            npc = tu.hitTestTile(player.state, npcArray, 0, world, "every");
            
            // Does player try to move to tile they shouldn't?
            if( !collide.hit || !npc.hit )
            {
               player.state.position.x += PLAYERMOVEAMOUNT;
            }
            
            // Does player transition to new area?
            if( !teleport.hit )
            {
               teleportPlayer( teleport.index );
            }
            
            // Does player encounter enemy?
            if( checkEnemyPlayerCollisions() )
            {
               if ( count == 1 ) 
               {
                  player.state.position.x += PLAYERMOVEAMOUNT;
                  generateBattleMenu();
                  //alert("" + player.position.x);
                  count--;
               }
            }
         }

         else if ( event.keyCode == DKEY ) 
         {
            // Update the player sprite to right facing player
            player.state.position.x += PLAYERMOVEAMOUNT;
            swapPlayer( player.state.position.x, player.state.position.y, 1, 1, "PlayerRight", 1, 3  );
            player.direction = RIGHT; 
            
            collide = tu.hitTestTile(player.state, collidableArray, 0, world, "every");
            teleport = tu.hitTestTile(player.state, teleportArray, 0, world, "every");
            npc = tu.hitTestTile(player.state, npcArray, 0, world, "every");
            
            // Does player try to move to tile they shouldn't?
            if( !collide.hit || !npc.hit )
            {
               player.state.position.x -= PLAYERMOVEAMOUNT;
            }
            
            // Does player transition to new area?
            if( !teleport.hit )
            {
               teleportPlayer( teleport.index );
            }
            
            // Does player encounter enemy?
            if( checkEnemyPlayerCollisions() )
            {
               if ( count == 1 ) 
               {
                  player.state.position.x -= PLAYERMOVEAMOUNT;
                  generateBattleMenu();
                  //alert("" + player.position.x);
                  count--;
               }
            }
         }
         
         else if ( event.keyCode == ENTER ) 
         {
            if( checkNPCInteraction() )
            {
               //dialogue.play();
               dialogueBox = createRoundedRect( 0, 400, 500, 100, 10, "white" );
               dialogueText.setText(currentArray[currentDialogue]);
               currentDialogue++;
   
               master_stage.addChild( dialogueBox );
               master_stage.addChild( dialogueText );
   
               dialogue_active = true;
               dialogueEnd = false;
            }
         }
      }


      else if ( battle_active )
      {
         if ( event.keyCode == WKEY ) { // Up key 38
            menu.up();
         }

         if ( event.keyCode == SKEY ) { // Down key 40
            menu.down();
         }

         if ( event.keyCode == ENTER ) { // Enter key
            
            if ( mode == FIGHT ) { fight( checkTarget() ); }

            else  if ( mode == SKILL ) { skill( checkTarget() ); }

            else  if ( mode == ITEM ) { useItem( checkTarget() ); }
         
            else if ( mode == RUN ) { run( checkTarget() ); }
         
         }
      }
      
      else if ( dialogue_active )
      {
         if( currentNPC == 999999 && currentDialogue == 0 )
         {
            getCurrentLine();
            
            dialogueBox = createRoundedRect( 0, 400, 500, 100, 10, "white" );
            dialogueText.setText(currentArray[currentDialogue]);
            currentDialogue++;

            master_stage.addChild( dialogueBox );
            master_stage.addChild( dialogueText );

            dialogue_active = true;
            dialogueEnd = false;
         }
		 
		 else if( currentNPC == 99999 && currentDialogue == 0 ) {
			getCurrentLine();
            
            dialogueBox = createRoundedRect( 0, 400, 500, 100, 10, "white" );
            dialogueText.setText(currentArray[currentDialogue]);
            currentDialogue++;

            master_stage.addChild( dialogueBox );
            master_stage.addChild( dialogueText );

            dialogue_active = true;
            dialogueEnd = false;
			
		 }
		 
		 if ( event.keyCode == QKEY && boss_choices  ) {
			master_stage.removeChild( dialogueBox );
			master_stage.removeChild( dialogueText );
			gameWinScreen.visible = true;
		 }
         
         if ( event.keyCode == ENTER || ( event.keyCode == EKEY && boss_choices ) )
         {
            if( !dialogueEnd )
            {  
               iterateDialogue();
            }
         }
      }
   }
}


function checkNPCInteraction()
{
   // NPC at 12, 112
   return checkValidInteraction( 12, 112 ) ||
          checkValidInteraction( 4, 114 ) ||
          checkValidInteraction( 17, 113 ) ||
          checkValidInteraction( 22, 117 ) ||
          checkValidInteraction( 20, 110 ) ||
          checkValidInteraction( 27, 110 ) ||
          checkValidInteraction( 27, 123 ) ||
          checkValidInteraction( 33, 121 ) ||
          checkValidInteraction( 34, 107 ) ||
          checkValidInteraction( 43, 107 ) ||
          checkValidInteraction( 4, 123 ) ||
          checkValidInteraction( 40, 121 ) ||
          checkValidInteraction( 65, 4 ) ||
          checkValidInteraction( 57, 108 ) ||
          checkValidInteraction( 65, 111 ) ||
          checkValidInteraction( 67, 114 ) ||
          checkValidInteraction( 63, 122 ) ||
          checkValidInteraction( 81, 115 ) ||
          checkValidInteraction( 90, 113 ) ||
          checkValidInteraction( 95, 108 ) ||
          checkValidInteraction( 94, 122 ) ||
          checkValidInteraction( 87, 118 ) ||
          checkValidInteraction( 17, 4 );
}


function checkValidInteraction( npcX, npcY )
{

   if( (player.direction == UP && 
       npcX * 25 == player.state.position.x && npcY * 25 + 25 == player.state.position.y) ||  
       
       (player.direction == DOWN && 
       npcX * 25 == player.state.position.x && npcY * 25 - 25 == player.state.position.y) ||
       
       (player.direction == LEFT && 
       npcX * 25 + 25 == player.state.position.x && npcY * 25 == player.state.position.y) ||
       
       (player.direction == RIGHT && 
       npcX * 25 - 25 == player.state.position.x && npcY * 25 == player.state.position.y)  )
   {
      currentNPC = parseInt("" + npcX + npcY);
      getCurrentLine();
      return true;
   }
}


function getCurrentLine()
{
   switch( currentNPC )
   {
      case 999999:
         currentArray = hard_enemy_dialogue;
         break;
	  case 99999:
		 currentArray = boss_enemy_dialogue;
		 break;
      case 12112:
         if( !npc12112_talked_to )
         {
            currentArray = npc12112_dialogue;
            player.attack++;
            npc12112_talked_to = true;
         }
         
         else
         {
            currentArray = npc12112X_dialogue;
         }
         
         break;
      case 4114:
         currentArray = npc4114_dialogue;
         break;
      case 17113:
         currentArray = npc17113_dialogue;
         break;
      case 22117:
         currentArray = npc22117_dialogue;
         break;
      case 20110:
         currentArray = npc20110_dialogue;
         break;
      case 27110:
         currentArray = npc27110_dialogue;
         break;
      case 27123:
         currentArray = npc27123_dialogue;
         break;
      case 33121:
         currentArray = npc33121_dialogue;
         player.armor = player.max_armor;
         player.health = 10;
         break;
      case 34107:
         currentArray = npc34107_dialogue;
         break;
      case 43107:
         currentArray = npc43107_dialogue;
         break;
      case 4123:
         currentArray = npc4123_dialogue;
         break;
      case 40121:
         if( !npc40121_talked_to )
         {
            currentArray = npc40121_dialogue;
            player.armor++;
            player.max_armor++;
            npc40121_talked_to = true;
         }
         
         else
         {
            currentArray = npc40121X_dialogue;
         }
         
         break;
         
      case 174:
         if( !npc174_talked_to )
         {
            currentArray = npc174_dialogue;
            player.armor++;
            player.max_armor++;
            npc174_talked_to = true;
         }
         
         else
         {
            currentArray = npc174X_dialogue;
         }
         
         break; 
         
      case 654:
         if( !npc654_talked_to )
         {
            currentArray = npc654_dialogue;
            player.armor++;
            player.max_armor++;
            npc654_talked_to = true;
         }
         
         else
         {
            currentArray = npc654X_dialogue;
         }
         
         break;
         
      case 57108:
         currentArray = npc57108_dialogue;
         break;
      case 65111:
         currentArray = npc65111_dialogue;
         break;
      case 67114:
         currentArray = npc67114_dialogue;
         break;
      case 63122:
         currentArray = npc63122_dialogue;
         break;
      case 81115:
         currentArray = npc81115_dialogue;
         break;
      case 90113:
         currentArray = npc90113_dialogue;
         break;
       case 95108:
         currentArray = npc95108_dialogue;
         break;
      case 94122:
         if( !npc94122_talked_to )
         {
            currentArray = npc94122_dialogue;
            player.armor++;
            player.max_armor++;
            npc94122_talked_to = true;
         }
         
         else
         {
            currentArray = npc94122X_dialogue;
         }
         
         break;
      case 87118:
         currentArray = npc87118_dialogue;
         player.armor = player.max_armor;
         player.health = 10;
         break;
   }
}


function iterateDialogue()
{  
   //dialogue.play();
   if( currentDialogue == currentArray.length )
   {
	  if ( currentNPC == 99999 ) {
		  transform();
	  }
	   
	  dialogueEnd = true;
      dialogue_active = false;
      master_stage.removeChild( dialogueBox );
      master_stage.removeChild( dialogueText );
      currentDialogue = 0;
   }
   
   else
   {
      dialogueText.setText(currentArray[currentDialogue]);
      currentDialogue++;
   }
}


function initialize_npc_dialogue()
{  // Needs enter when longer than --------------------------------
   npc12112_dialogue.push( "I'm the town's blacksmith, but I\n"+
                           "graduated with a degree in literature..." );
   npc12112_dialogue.push( "I've honed my craft over the years\n"+
                           "though! Here, let me teach you a thing\n" +
                           "or two...");
   npc12112_dialogue.push( "Your attack increased!" );
   npc12112_dialogue.push( "Also, 1 armor equal 10 health! So if\n"+
                           "you have 2 armor, you have 20 total\n" +
                           "health. But beware! You cannot restore");
   npc12112_dialogue.push( "armor in combat, only health. Find\n"+
                           "someone in a town who can restore it\n" +
                           "for you.");
   
   // Needs enter when longer than --------------------------------
   npc12112X_dialogue.push( "Sheesh, trying to take advantage of\n" +
                            "my generosity even more? Greedy lil\n"+
                            "bugger...");
   
   npc4114_dialogue.push( "I am a town guard, I help keep this\n"+
                          "place safe!" );
   
   // Needs enter when longer than --------------------------------
   npc17113_dialogue.push( "Oh someone help us! There is a great\n"+
                           "evil that wishes to destroy us all!\n" );
   npc17113_dialogue.push( "You there, please help! There is a\n"+
                           "monster that is going to wipe out the\n"+
                           "world!" );
   npc17113_dialogue.push( "He is only known as the Shadow King,\n"+
                           "and he is going to suck the life from\n" + 
                           "this world! Please help us!" );
   npc17113_dialogue.push( "You would be hailed a hero if he were\n"+
                           "slain by your hand!" );
   
   // Needs enter when longer than --------------------------------
   npc22117_dialogue.push( "If I jump into the pond and swam\n"+
                           "far away, would anyone chase after\n" +
                           "me?" );
   
   // Needs enter when longer than --------------------------------
   npc20110_dialogue.push( "I love looking in the water and seeing\n"+
                           "my reflection looking back!" );
   npc20110_dialogue.push( "It's kinda creepy when she smiles back\n"+
                           "and I'm not...");
   
   // Needs enter when longer than --------------------------------
   npc27110_dialogue.push( "My wife accused me of sneaking off to\n"+
                           "try and slay the monster!" );
   npc27110_dialogue.push( "All I was trying to do was surprise\n"+
                           "her with flowers..." );
   
   // Needs enter when longer than --------------------------------
   npc27123_dialogue.push( "I am unsure how I am able to walk on\n"+
                           "water..." );
   npc27123_dialogue.push( "This is a precarious situation. \n"+
                           "One second me and Billy were\n" +
                           "walking around the pond. I tried\n" );
   npc27123_dialogue.push( "to splash him by jumping.\n"  +
                           "Low and behold the water did not \n" +
                           "move. I ventured slightly further\n" );
   npc27123_dialogue.push( "and ended up here.\n" +
                           "Where did Billy dash off to though?\n" +
                           "In my glee of waterwalking, he\n" );
   npc27123_dialogue.push( "vanished... I hope a monster did\n" +
                           "not get him!\n" +
                           "I must go, if the others see this\n");
   npc27123_dialogue.push( "I may be tried for witchcraft.\n" +
                           "They cannot comprehend my gift. \n" );
   
   // Needs enter when longer than --------------------------------
   npc33121_dialogue.push( "You look injured! Let me patch you\n" +
                           "up!");
   npc33121_dialogue.push( "Your health and armor has been \n"+
                           "restored!" );
   
   // Needs enter when longer than --------------------------------
   npc34107_dialogue.push( "Hello citizen, have no fear, Town\n" +
                           "Guard is here! Oh, you are going\n" +
                           "to be a hero and slay the monster?" );
   npc34107_dialogue.push( "Right... good luck with that." );
   
   // Needs enter when longer than --------------------------------
   npc43107_dialogue.push( "Hey I recognize that sword! It's the \n" +
                           "hero sword right? The one that gets\n"+
                           "stronger the more monsters you kill?" );
   npc43107_dialogue.push( "You best be careful out there, the King\n" +
                           "is absorbing monsters to power up...\n"+
                           "If you flee from a monster, it will get" );
   npc43107_dialogue.push( "absorbed by the Shadow King to \n" +
                           "power his world ending attack! Better \n"+
                           "kill them while you have the chance." );
   npc43107_dialogue.push( "I'll say nice things at your funeral.\n" +
                           "It's too dangerous for anyone to \n"+
                           "survive out there." );
   
   // Needs enter when longer than --------------------------------
   npc4123_dialogue.push( "Oh my, a dashing young hero to save\n" +
                          "us all! Thank you youngster. Now I\n"+
                          "can tend to my crops again." );
   
   // Needs enter when longer than --------------------------------
   npc40121_dialogue.push( "I wish I could still adventure like\n"+
                           "you! You inspire me, please take my\n" +
                           "knowledge of defense!" );
   npc40121_dialogue.push( "Your armor has increased!" );
   
   // Needs enter when longer than --------------------------------
   npc40121X_dialogue.push( "You've already taken my knowledge...\n" + 
                            "What more do you want of me!?" ); 
   
   // Needs enter when longer than --------------------------------
   npc174_dialogue.push( "You saved me, thank you! Here..."); 
   npc174_dialogue.push( "Your armor has increased!" );
   
   // Needs enter when longer than --------------------------------
   npc174X_dialogue.push( "You saved me, thank you!" ); 
   
   // Needs enter when longer than --------------------------------
   npc654_dialogue.push( "You saved me, thank you! Here..."); 
   npc654_dialogue.push( "Your armor has increased!" );
   
   // Needs enter when longer than --------------------------------
   npc654X_dialogue.push( "You saved me, thank you!" ); 
   
   // Needs enter when longer than --------------------------------
   npc57108_dialogue.push( "Yo yo yo." ); 
   npc57108_dialogue.push( "Everything's good here pal." ); 
   
   // Needs enter when longer than --------------------------------
   npc65111_dialogue.push( "How's it going millennial?" );
   npc65111_dialogue.push( "Stop calling me a boomer, k?" ); 
   
   // Needs enter when longe---------------------------------------
   npc67114_dialogue.push( "I stand here in the middle of town\n" +
                           "to remind myself that I am tiny in this\n"+
                           "universe and mean nothing."); 
   
   // Needs enter when long ---------------------------------------
   npc63122_dialogue.push( "I just wanna play ball without being\n" +
                           "chased by a possessed soldier..."); 
   
   // Needs enter when longer than --------------------------------
   npc81115_dialogue.push( "How do they expect a retirement town\n" +
                           "to be safe from the likes of the King?");
   npc81115_dialogue.push( "We can barely defend ourselves from\n" +
                           "the weather out here!");
   
   // Needs enter when longe---------------------------------------
   npc90113_dialogue.push( "This dusty place will soon wither and\n" +
                           "crumble... Just like my dear Denise"); 
   
   // Needs enter when han ---------------------------------------
   npc95108_dialogue.push( "This way to the king! Do not let him\n" +
                           "destroy our lives, please!"); 
   
   // Needs enter when longe---------------------------------------
   npc94122_dialogue.push( "Oh, your armor is looking a tad worn.\n" +
                           "Allow me to lather it in ogre milk to\n" +
                           "restore its luster.");
   npc94122_dialogue.push( "Your armor has increased!" );
   
   // Needs enter when longer than --------------------------------
   npc94122X_dialogue.push( "I'm all out of milk, AHHHHH!!!!!" ); 
   
   // Needs enter when longer than --------------------------------
   npc87118_dialogue.push( "You look injured! Let me patch you\n" +
                           "up!");
   npc87118_dialogue.push( "Your health and armor has been \n"+
                           "restored!" );
                           
   hard_enemy_dialogue.push( "You beat a tough enemy!" );
   hard_enemy_dialogue.push( "Your armor has increased!" );
   
   //                        ---------------------------------------
   boss_enemy_dialogue.push("You... you ANIMAL! How could YOU \n"+
                            "hurt me, I am IMMORTAL! I shouldn't \n"+
                            "be hurt by such simple human tools...");
   boss_enemy_dialogue.push("I have a proposal for you scum, join \n"+
                            "me and rule this realm with me! We\n"+
                            "would be invincible, unbeatable!");
   boss_enemy_dialogue.push("Accept or decline the demon's offer.\n"+
                            "Yes:  Press Q         No: Press E");
   boss_enemy_dialogue.push("You betrayed my GRACIOUS OFFER??\n"+
                            "THEN DIE WITH ALL OF THE HUMAN\n"+
                            "SCUM!!! BEHOLD MY TRUE FORM!!!");
   
}


// Transition player to new area based on teleporter touched
function teleportPlayer( teleportIndex )
{
   //alert(teleportIndex);
   switch( teleportIndex )
   {
      case 10644:
         player.state.position.x = PLAYERMOVEAMOUNT * 4;
         player.state.position.y = PLAYERMOVEAMOUNT * 3;
         swapPlayer( player.state.position.x, player.state.position.y, 1, 1, "PlayerDown", 1, 3  );
         player.direction = DOWN;
         battleBackground = FOREST;
         break;
         
      case 204:
         player.state.position.x = PLAYERMOVEAMOUNT * 44;
         player.state.position.y = PLAYERMOVEAMOUNT * 107;
         swapPlayer( player.state.position.x, player.state.position.y, 1, 1, "PlayerDown", 1, 3  );
         player.direction = DOWN;
         battleBackground = FOREST;
         break;
      
      case 4544:
         player.state.position.x = PLAYERMOVEAMOUNT * 55;
         player.state.position.y = PLAYERMOVEAMOUNT * 44;
         swapPlayer(player.state.position.x, player.state.position.y, 1, 1, "PlayerUp", 1, 3  );
         player.direction = UP;
         battleBackground = DESERT;
         break;
      
      case 4555:
        player.state.position.x = PLAYERMOVEAMOUNT * 44;
        player.state.position.y = PLAYERMOVEAMOUNT * 44;
        swapPlayer( player.state.position.x, player.state.position.y, 1, 1, "PlayerUp", 1, 3  );
        player.direction = UP;
        battleBackground = FOREST;
        break;
      
      case 495:
        player.state.position.x = PLAYERMOVEAMOUNT * 55;
        player.state.position.y = PLAYERMOVEAMOUNT * 107;
        swapPlayer( player.state.position.x, player.state.position.y, 1, 1, "PlayerDown", 1, 3  );
        player.direction = DOWN;
        battleBackground = DESERT;
        break;
      
      case 10655:
         player.state.position.x = PLAYERMOVEAMOUNT * 95;
         player.state.position.y = PLAYERMOVEAMOUNT * 5;
         swapPlayer( player.state.position.x, player.state.position.y, 1, 1, "PlayerDown", 1, 3  );
         player.direction = DOWN;
         battleBackground = DESERT;
         break;
      
      case 10698:
         player.state.position.x = PLAYERMOVEAMOUNT * 1;
         player.state.position.y = PLAYERMOVEAMOUNT * 94;
         swapPlayer( player.state.position.x,player.state.position.y, 1, 1, "PlayerUp", 1, 3  );
         player.direction = UP;
         battleBackground = SNOW;
         break;
         
      case 9501:
        player.state.position.x = PLAYERMOVEAMOUNT * 98;
        player.state.position.y = PLAYERMOVEAMOUNT * 107;
         swapPlayer( player.state.position.x, player.state.position.y, 1, 1, "PlayerDown", 1, 3  );
         player.direction = DOWN;
         battleBackground = DESERT;
         break;
      
      case 5644:
        player.state.position.x = PLAYERMOVEAMOUNT * 55;
        player.state.position.y = PLAYERMOVEAMOUNT * 57;
        swapPlayer( player.state.position.x, player.state.position.y, 1, 1, "PlayerDown", 1, 3  );
        player.direction = DOWN;
        battleBackground = CAVE;
        break;
      
      case 5655:
        player.state.position.x = PLAYERMOVEAMOUNT * 44;
        player.state.position.y = PLAYERMOVEAMOUNT * 57;
        swapPlayer( player.state.position.x, player.state.position.y, 1, 1, "PlayerDown", 1, 3  );
        player.direction = DOWN;
        battleBackground = SNOW;
        break;
   }
}


/**
	Builds the different screens of the game
*/
function buildScreens() {
   startScreen.visible = true;
   instructScreen.visible = false;
   creditScreen.visible = false;
   gameWinScreen.visible = false;
   gameLoseScreen.visible = false;
   statsScreen.visible = false;

    // Text for titles
   var gameStatsText = new PIXI.Text( "Stats", {fill : 0x000000} );
   var playerAttackText = new PIXI.Text( "Attack:" , {fill : 0xFFFFFF} );
   var playerHealthText = new PIXI.Text( "Health:", {fill : 0xFFFFFF} );
   var playerArmorText = new PIXI.Text( "Armor:", {fill : 0xFFFFFF} );
   var gameTitleText = new PIXI.Text( "Shadow Hero", {fill : 0xFFFFFF} );
   var gameInstructTitleText = new PIXI.Text( "Instructions", {fill : 0xFFFFFF} );
   var gameCreditTitleText = new PIXI.Text( "Credits", {fill : 0xFFFFFF} );
   var gameWinText = new PIXI.Text( "Game over!\nYou win!", {fill : 0xFFFFFF, align: 'center'} );
   var gameLoseText = new PIXI.Text("Game over!\nThe World has been consumed.", {fill : 0xFFFFFF, align: 'center'} );

   // Text for title screen options
   var gameStartText = new PIXI.Text( "Start", {fill : 0xFFFFFF} );
   var gameInstructText = new PIXI.Text( "Instructions", {fill : 0xFFFFFF} );
   var gameCredText = new PIXI.Text( "Credits", {fill : 0xFFFFFF} );  
   var gameCredBackText = new PIXI.Text( "<- Back", {fill : 0xFFFFFF} );
   var gameStatsBackText = new PIXI.Text( "Back", {fill : 0xFFFFFF} );
   var gameInstructBackText = new PIXI.Text( "<- Back", {fill : 0xFFFFFF} );
   var gameWinRestartText = new PIXI.Text( "Play again", {fill : 0xFFFFFF} );
   var gameLoseRestartText = new PIXI.Text( "Play again", {fill : 0xFFFFFF} );

   
   // Adds regular text -----------------------------------------------------
   var gameInstructDesc = new PIXI.Text( "The hero must defeat the Shadow\n" + 
                                         "King and save the world! Use WASD\n" + 
                                         "to navigate the world. Talk to as\n" +
                                         "many people as you can in order to\n" + 
                                         "gather as much info as possible!\n\n" + 
                                         "Some townsfolk can even help you\n" + 
                                         "by making you stronger! Walk up to\n" +
                                         "some and press Enter to talk to them.", {fill : 0xFFFFFF} );
   var gameCredDesc = new PIXI.Text( "Authors: \nJohn Jacobelli\nJesse Rodriguez\nTyler "+
                                     "Pehringer\n\nRenderer used: PixiJS", {fill : 0xFFFFFF} );

   // Declare texts interactable
   gameStatsText.interactive = false;
   gameStatsBackText.interactive = true;
   gameStartText.interactive = true;
   gameInstructText.interactive = true;
   gameCredText.interactive = true;
   gameCredBackText.interactive = true;
   gameInstructBackText.interactive = true;
   gameWinRestartText.interactive = true;
   gameLoseRestartText.interactive = true;

   
   // Declares interactable text functions
   gameStatsText.click = function(event) { statsScreen.visible = true;
                                           playerAttackText.setText( "Attack: " + player.attack );
                                           currentHealthSprite = createSprite( 103, 437, 1, 1, "ex_meter" + 
                                                                  player.health + ".png" );
                                           statsScreen.addChild( currentHealthSprite );
                                           
                                           currentArmorSprite = createSprite( 103, 470, 1, 1, "armor" + 
                                                                  player.armor + ".png" );
                                           statsScreen.addChild( currentArmorSprite );
                                           //open_menu.play();
                                           }
   
   gameStatsBackText.click = function(event) { statsScreen.visible = false; 
                                               statsScreen.removeChild( currentHealthSprite );
                                               statsScreen.removeChild( currentArmorSprite );
                                           }
                                           
   gameStartText.click = function(event) { startScreen.visible = false; 
                                           game_stage.visible = true;
                                           gameStatsText.visible = true;
										   gameStatsText.interactive = true; }
                                           
   gameInstructText.click = function(event) { instructScreen.visible = true;
                                              startScreen.visible = false; }
                                              
   gameCredText.click = function(event) { creditScreen.visible = true;
                                          startScreen.visible = false; }
                                          
   gameCredBackText.click = function(event) { startScreen.visible = true;
                                              creditScreen.visible = false; }
                                              
   gameInstructBackText.click = function(event) { startScreen.visible = true;
                                                  instructScreen.visible = false; }
                                                  
   gameWinRestartText.click = function(event) { location.reload(); }
   
   gameLoseRestartText.click = function(event) { location.reload(); }
    
   
   // Create background for screens screen
   var graphics1 = createShape();
   var graphics2 = createShape();
   var graphics3 = createShape();
   var graphics4 = createShape();
   var graphics5 = createShape();
   var graphics6 = new PIXI.Graphics();
   graphics6.beginFill('0x000000');
   graphics6.drawRect(0, 400, 500, 100);
   graphics6.endFill();
   
   startScreen.addChild( graphics1 );
   instructScreen.addChild( graphics2 );
   creditScreen.addChild( graphics3 );
   gameWinScreen.addChild( graphics4 );
   gameLoseScreen.addChild( graphics5 );
   statsScreen.addChild( graphics6 );

   // Add text to screens
   startScreen.addChild( gameTitleText );
   startScreen.addChild( gameStartText );
   startScreen.addChild( gameInstructText );
   startScreen.addChild( gameCredText );
   instructScreen.addChild( gameInstructTitleText );
   instructScreen.addChild( gameInstructDesc );
   instructScreen.addChild( gameInstructBackText );
   creditScreen.addChild( gameCredBackText );
   creditScreen.addChild( gameCreditTitleText );
   creditScreen.addChild( gameCredDesc );
   gameWinScreen.addChild( gameWinRestartText );
   gameWinScreen.addChild( gameWinText );
   gameLoseScreen.addChild( gameLoseRestartText );
   gameLoseScreen.addChild( gameLoseText );
   statsScreen.addChild( gameStatsBackText );
   statsScreen.addChild( playerAttackText );
   statsScreen.addChild( playerHealthText );
   statsScreen.addChild( playerArmorText );
   master_stage.addChild( gameStatsText );
   
   // Set anchors for text
   gameStatsText.anchor.set( 1 );
   gameStatsBackText.anchor.set( 1 );
   gameTitleText.anchor.set( .5 );
   gameStartText.anchor.set( .5 );
   gameInstructText.anchor.set( .5 );
   gameCredText.anchor.set( .5 );
   gameInstructTitleText.anchor.set( .5 );
   gameInstructBackText.anchor.set( 1 );
   gameCredBackText.anchor.set( 1 );
   gameCreditTitleText.anchor.set( .5 );
   gameWinText.anchor.set( .5 );
   gameLoseText.anchor.set( .5 );
   gameWinRestartText.anchor.set( .5 );
   gameLoseRestartText.anchor.set( .5 );

   // Place Text
   gameStatsText.x = GAME_WIDTH - 15; gameStatsText.y = GAME_HEIGHT - 15;
   gameStatsBackText.x = GAME_WIDTH - 15; gameStatsBackText.y = GAME_HEIGHT - 15;
   playerAttackText.x = 5; playerAttackText.y = 405;
   playerHealthText.x = 5; playerHealthText.y = 435;
   playerArmorText.x = 5; playerArmorText.y = 465;
   gameTitleText.x = GAME_WIDTH/2; gameTitleText.y = GAME_HEIGHT/4;
   gameStartText.x = GAME_WIDTH/6; gameStartText.y = GAME_HEIGHT/4 * 3;
   gameInstructText.x = GAME_WIDTH/2 ; gameInstructText.y = GAME_HEIGHT/4 * 3;
   gameCredText.x = GAME_WIDTH/6 * 5; gameCredText.y = GAME_HEIGHT/4 * 3;
   gameInstructTitleText.x = GAME_WIDTH/2; gameInstructTitleText.y = GAME_HEIGHT/4;
   gameInstructDesc.x = 25; gameInstructDesc.y = GAME_HEIGHT * 1.5 /4;
   gameCreditTitleText.x = GAME_WIDTH/2; gameCreditTitleText.y = GAME_HEIGHT/4;
   gameCredDesc.x = 25; gameCredDesc.y = GAME_HEIGHT/2;
   gameInstructBackText.x = GAME_WIDTH - 25; gameInstructBackText.y = GAME_WIDTH - 25;
   gameCredBackText.x = GAME_WIDTH - 25; gameCredBackText.y = GAME_WIDTH - 25;
   gameWinText.x = GAME_WIDTH/2; gameWinText.y = GAME_HEIGHT/3 + 10;
   gameLoseText.x = GAME_WIDTH/2; gameLoseText.y = GAME_HEIGHT/3 + 10;
   gameWinRestartText.x = GAME_WIDTH/2; gameWinRestartText.y = 2 * GAME_HEIGHT/3;
   gameLoseRestartText.x = GAME_WIDTH/2; gameLoseRestartText.y = 2 * GAME_HEIGHT/3;
   
   // Add screens to stage
   master_stage.addChild( startScreen );
   master_stage.addChild( instructScreen );
   master_stage.addChild( creditScreen );
   master_stage.addChild( gameWinScreen );
   master_stage.addChild( gameLoseScreen );
   master_stage.addChild( statsScreen );
}


/**
*/
function createShape() {
   var graphics = new PIXI.Graphics();
   graphics.beginFill('0x000000');
   graphics.drawRect(0, 0, 500, 500);
   graphics.endFill();
   return graphics;
}


function checkTarget(){

	for(var i in enemies){
		var foe = enemies[i];
		if(foe.is_hit) {
			return foe;
		}
	}
}

function fight( foe ) { //Pass in enemy
  //attack.play();
  if( player.speed > foe.speed ) {
	playerAttack( foe );
	
	if ( player.is_alive && foe.is_alive ) {
		enemyAttack( foe ); //Pass in enemy
	}
  }

  else {
	if ( player.is_alive && foe.is_alive ) {
		enemyAttack( foe ); //Pass in enemy
	}
	
	playerAttack( foe );
  }
}

/**
	Handles player attack in combat
*/
function playerAttack( foe ) {
	if (player.is_alive) {
		//alert("Your attack hit the enemy for " + player_attack + " damage.");
		/**
		swapPlayer( 100, 200, 5, 5, "PlayerAttack", 1, 3  );
		player.loop = false;
		player.onComplete = swapPlayer( 100, 200, 5, 5, "PlayerRight", 1, 3  );
		var temp_state = foe.state;
		foe.state = createMovieClip( foe.state.position.x, foe.state.position.y, foe.state.scale.x, foe.state.scale.y, foe.name + "damage", 1, 3 );
		foe.loop = false;
		
		var animationFinished = function () {
			//alert("Animation just reached it's end.");
			foe.state = temp_state;
			foe.gotoAndStop(0);
		};
		
		foe.onComplete = animationFinished;*/
		
		var temp_attack = player.attack;

		if( player.is_boosted ) {
			player.health--;
			temp_attack*=2;
		}
		
		foe.health -= temp_attack;

		if ( foe.health <= 0 ) { 
			
			//alert("The enemy has been slain.");
			if (foe.num_charges <= 1) 
         {
				if(foe.id != SEXY_HENCHMAN && foe.id != DEMON_LEECH ) {
					foe.is_alive = false;
					var index = enemies.indexOf( foe );
					if (index > -1) {
						enemies.splice(index, 1);
					}
				
					endBattle(foe);
					if ( foe.id == OGRE || foe.id == SKELETON || foe.id == EVIL_TREE ) {
						
						currentNPC = 999999;
						dialogue_active = true;
						player.armor++;
						player.max_armor++;
					}
				}
				
				else if ( foe.id == DEMON_LEECH) {
					//Final_Form_Death.play();
					endBattle(foe);
					gameWinScreen.visible = true;
               //game_win.play();
				}
				
				else {
					//Sexy_Minion_Death.play();
					endBattle(foe);
					boss_choices = true;
					currentNPC = 99999;
					dialogue_active = true;
				}
				
			
			}
			foe.health = 10;
			foe.loseCharge();
			
		}
	}
}

/**
	Helper function that handles enemy attack in combat
*/
function enemyAttack( foe ) {
	if ( foe.is_alive ) {
		var enemy_chance = getRand(10);
		
		if ( enemy_chance < 8 ) {
			//alert( "The enemy hits you for " + foe.attack + " damage." );
			player.health -= foe.attack;
		}

		else {
			//alert("The enemy misses their attack.");
		}

		if ( player.health <= 0 ) {
			//alert("You have fallen in battle. ;-;");
			if ( player.armor <= 1 ) {
				game_stage.removeChild( player.state );
				player.state.stop();
				player.is_alive = false;
				endBattle( foe );
            
				gameLoseScreen.visible = true;
            //game_lose.play();
			}
			
         player.armor--;
		}
	}
}

/**
	Helper function that handles skill action in combat
*/
function skill( foe ) {
	//power_up.play();
	if( player.speed > foe.speed ) 
   {
      if( !player.is_boosted ) 
      {
         player.is_boosted = true;
      }
	
		if ( player.is_alive && foe.is_alive ) 
      {
			enemyAttack( foe ); //Pass in enemy
		}
	}

	else 
   {
		if ( player.is_alive && foe.is_alive ) 
      {
			enemyAttack( foe ); //Pass in enemy
		}
	
		if( !player.is_boosted ) 
      {
			player.is_boosted = true;
		}
  }
}

/**
	Helper function that handles using an item action in combat
*/
function useItem( foe ) {
	//alert("You drink a health potion.");
	//potion.play();
	player.health += getRand(3) + 2; //30% - 50%
	enemyAttack( foe );
}

/**
	Helper function that handles run action in combat
*/
function run( foe ) {
	//run_away.play();
	endBattle( foe );
	if ( foe.id == DEMON_LEECH || foe.id == SEXY_HENCHMAN || foe.id == SHADOW_KING || foe.id == EVIL_TREE || foe.id == EVIL_SNOWMAN ) { gameLoseScreen.visible = true; }
		//game_lose.play(); 
}


/**
	Helper function that ends the battle
*/
function endBattle ( foe ) {
	battle_active = false;
	foe.is_hit = false;
	
   if( player.is_boosted )
   {
      player.is_boosted = false;
      
   }
   
	if( foe.health <= 0 )
   {
      if( foe.id === GOBLIN || foe.id === POSSESSED_SOLDIER || foe.id === SNOW_DEVIL || foe.id === EVIL_SNOWMAN ) { player.attack++; }
	  if( foe.id === PIXIE || foe.id === ICE_WRAITH || foe.id === BAT ) { player.speed++; }
   }
   

	moveHand(hand.position.x, menu_text.position.y + 
                           menu_text.height - 10);
	while ( mode != RUN) {
		menu.down();
	}
	count = 1;
	clearBattleScreen();
}

function clearBattleScreen() {
	battle_text_stage.removeChild( hand );
	battle_text_stage.removeChild( menu_text );
	battle_stage.removeChild( battle_screen );
	battle_stage.removeChild( player.state );
	
	switch ( temp_direction ) {
			case UP:
				swapPlayer( temp_x, temp_y, 1, 1, "PlayerUp", 1, 3  );
				break;
			case DOWN:
				swapPlayer( temp_x, temp_y, 1, 1, "PlayerDown", 1, 3  );
				break;
			case LEFT:
				swapPlayer( temp_x, temp_y, 1, 1, "PlayerLeft", 1, 3  );
				break;
			case RIGHT:
				swapPlayer( temp_x, temp_y, 1, 1, "PlayerRight", 1, 3  );
				break;
	}
	
	battle_stage.removeChild( current_enemy.state );
	master_stage.removeChild( battle_stage ); 
}

/**
	Helper function that creates a sprite
*/
function createSprite (x, y, scale_x, scale_y, image ) {
	var sprite = new PIXI.Sprite( PIXI.Texture.fromFrame( image ) );
	sprite.position.x = x;
	sprite.position.y = y;
	sprite.scale.x = scale_y;
	sprite.scale.y = scale_x;
	sprite.vx = 0;
	sprite.vy = 0;
	sprite.moving = false;
	return sprite;
}

/**
	Helper function that creates a rounded rectangle
*/
function createRoundedRect( x, y, width, height, radius, color ) {
	var graphics = new PIXI.Graphics();
	graphics.beginFill(color);
	graphics.drawRoundedRect( x, y, width, height, radius );
	graphics.endFill();
	return graphics;
}

/**
	Helper function that returns a movie clip
*/
function createMovieClip ( x, y, scale_x, scale_y, image, low, high ) {
	var clips = [];
	for ( var i = low; i <= high; i++ ) {
    		clips.push( PIXI.Texture.fromFrame( image + i + '.png' ) );
  	}
	
	var movie_clip = new PIXI.extras.MovieClip( clips );
	movie_clip.scale.x = scale_x;
	movie_clip.scale.y = scale_y;
	movie_clip.position.x = x;
	movie_clip.position.y = y;
	movie_clip.animationSpeed = 0.1;
	movie_clip.play();	
  	return movie_clip;
}

/**
	Helper function that swaps the player sprite
*/
function swapPlayer ( x, y, scale_x, scale_y, image, low, high ) {
	game_stage.removeChild( player.state );
	player.state = createMovieClip( x, y, scale_x, scale_y, image, low, high );
	game_stage.addChild( player.state );
}

function transform () {
	//clearBattleScreen();
			
			for(var i in enemies){
				var foe = enemies[i];
				if(foe.id == DEMON_LEECH) {
					foe.is_hit = true;
				}
			} 
			generateBattleMenu();
}

/**
	Helper function that returns a random number from 1 to max
*/
function getRand( max ) {
	return Math.floor(( Math.random() * max ) + 1 );
}

/**
	Updates the camera
*/
function update_camera() {
  game_stage.x = -player.state.position.x*GAME_SCALE + GAME_WIDTH/2 - player.state.width/2*GAME_SCALE;
  game_stage.y = -player.state.position.y*GAME_SCALE + GAME_HEIGHT/2 + player.state.height/2*GAME_SCALE;
  game_stage.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - GAME_WIDTH, -game_stage.x));
  game_stage.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - GAME_HEIGHT, -game_stage.y)); 
}

/**
---------------------------------------------------
Enemy Class
---------------------------------------------------
Example:
enemy = new Enemy({id: 1(monster id), x: 700, y: 400, state: enemy_sprite, name: "Common Bat", attack: 3, speed: 2}); 	//instantiation
enemy.updateHealthBar(); 																			//calling a method     
*/
function Enemy(obj) {
    'use strict';
    if (typeof obj === "undefined") { // DEFAULT
		this.id = 1;
		this.num_charges = 4;
		this.x = 750;
		this.y = 500;
        this.state = createMovieClip( this.x, this.y, .6, .6, "Bat", 1, 7 );
		this.state.animationSpeed = 0.25;
        this.name = "Bat";
		this.health = 10;
		this.health_meter = createSprite( 350, 400, .5, .5, ( "ex_meter10.png" ) );
		this.attack = 4;
		this.speed = 8;
		this.is_alive = true;
		this.is_hit = false;
    } 
	
	else {
		this.id = obj.id;
		this.num_charges = obj.num_charges;
		this.x = obj.x;
		this.y = obj.y;
        this.state = obj.state;
        this.name = obj.name;
		this.health = 10;
		this.health_meter = createSprite( 350, 400, .5, .5, ( "ex_meter10.png" ) );
		this.attack = obj.attack;
		this.speed = obj.speed;
		this.is_alive = true;
		this.is_hit = false;
    }

}

/**
	Updates the enemy health meter
*/
Enemy.prototype.updateHealthBar = function () {
    'use strict';
	if ( this.health_meter != null ) {
		battle_stage.removeChild( this.health_meter );
		delete this.health_meter;
	}
	
	if ( this.num_charges > 0 ) {
		if ( this.health <= 0 ) {
			while ( this.health < -10 ) {
				this.num_charges--;
				this.health += 10;
			}
			this.health += 10; 
		}
	}
	
	if ( this.num_charges <= 0 || this.health == 0 ) {
		if(this.id != SEXY_HENCHMAN && this.id != DEMON_LEECH ) {
			
			this.is_alive = false;
			
			var index = enemies.indexOf( this );
			if (index > -1) {
				enemies.splice(index, 1);
			}
			endBattle(this);
			if ( this.id == OGRE || this.id == SKELETON || this.id == EVIL_TREE || this.id == EVIL_SNOWMAN ) {
				
				currentNPC = 999999;
				dialogue_active = true;
				player.armor++;
			}
			
		}
		
		else if ( current_enemy.id === DEMON_LEECH) {
			//Final_Form_Death.play();
			endBattle(this);
			gameWinScreen.visible = true;
         //game_win.play();
		}
		
		else {
			//Sexy_Minion_Death.play();
			endBattle(this);
			currentNPC = 99999;
			boss_choices = true;
			dialogue_active = true;
		}
	}
	
	threat_stage.removeChildren();
	
	for ( var i = this.num_charges; i > 0; i-- ) {
			if ( current_enemy.id === DEMON_LEECH ) {
				danger_level = createMovieClip( 495 - (i*25), 410, .8, .8, "laughing_skull", 1, 5 );
			}
			
			else {
				danger_level = createMovieClip( 470 - (i*25), 410, .8, .8, "laughing_skull", 1, 5 );
			}
				
				threat_stage.addChild( danger_level );
	}

	if ( this.health < 0 ) { this.health = 0; }

	if ( this.health > 10 ) { this.health = 10; }
	
	if ( this.is_alive ) {
		this.health_meter = createSprite( 350, 400, .5, .5, ( "ex_meter" + ( Math.round( this.health ) ) + ".png" ) );
		battle_stage.addChild( this.health_meter );
	}
};

Enemy.prototype.addCharge = function () {
	this.num_charges++;
};

Enemy.prototype.loseCharge = function () {
	this.num_charges--;
};


/**
---------------------------------------------------
Player Class
---------------------------------------------------
Example:
player = new Player({name: "Hero", 
					 state: createMovieClip( PLAYER_START_X, PLAYER_START_Y, 1, 1, "PlayerRight", 1, 3 ),  
					 attack: 1, 
					 armor: 1,
					 speed: 2}); 	//instantiation
enemy.updateHealthBar(); 																			//calling a method     
*/
function Player(obj) {
    'use strict';
    if (typeof obj === "undefined") { // DEFAULT
		this.name = "Hero";
		this.state = createMovieClip( PLAYER_START_X, PLAYER_START_Y, 1, 1, "PlayerRight", 1, 3 );
		this.text = new PIXI.extras.BitmapText(this.name, {font: "16px gamefont"});
		this.text.position.x = 10;
		this.text.position.y = 250;
		this.health = 10;
		this.attack = 1;
		this.health_meter;
		this.is_alive = true;
		this.is_boosted = false;
		this.armor = 1;
		this.max_armor = 1;
		this.speed = 5;
		this.direction = RIGHT;
	}
	
	else {
		this.name = obj.name;
		this.state = obj.state;
		this.text = new PIXI.extras.BitmapText(this.name, {font: "16px gamefont"});
		this.text.position.x = 10;
		this.text.position.y = 250;
		this.health = 10;
		this.attack = obj.attack;
		this.health_meter;
		this.is_alive = true;
		this.is_boosted = false;
		this.armor = obj.armor;
		this.max_armor = this.armor;
		this.speed = obj.speed;
		this.direction = RIGHT;
    }

}

/**
	Updates the enemy health meter
*/
Player.prototype.updateHealthBar = function () {
    'use strict';
	if ( this.health_meter != null ) {
		battle_stage.removeChild( this.health_meter );
		delete this.health_meter;
	}
	
	if ( this.armor > 0 ) {
		if ( this.health <= 0 ) { this.health += 10; }
	}
	
	player_threat_stage.removeChildren();
	
	for ( var i = this.armor; i > 0; i-- ) {
		if ( i > 5 ) {
			danger_level = createSprite( (i*25) - 150, this.state.position.y + 240, 1.5, 1.5, "armor.png");
		}	
		
		else {
			danger_level = createSprite( (i*25) - 25, this.state.position.y + 210, 1.5, 1.5, "armor.png");
		}
		
		player_threat_stage.addChild( danger_level );
	}
	
	if ( this.health < 0 ) { this.health = 0; }

	if ( this.health > 10 ) { this.health = 10; }

	if ( this.is_alive ) {
		if ( current_enemy.id === DEMON_LEECH ) {
			this.health_meter = createSprite( this.state.position.x - 40, this.state.position.y + 200, .5, .5, ( "ex_meter" + ( Math.round( this.health ) ) + ".png" ) );
		}
		
		else {
			this.health_meter = createSprite( this.state.position.x - 90, this.state.position.y + 200, .5, .5, ( "ex_meter" + ( Math.round( this.health ) ) + ".png" ) );
		}
		battle_stage.addChild( this.health_meter );
	}
};
