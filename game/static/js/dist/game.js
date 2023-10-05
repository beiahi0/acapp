class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
        <div class="ac-game-menu">
        <div class="ac-game-menu-field">
            <div class="ac-game-menu-field-item ac-game-menu-field-single-mode">
                单人模式
            </div>
            <br>
            <div class="ac-game-menu-field-item ac-game-menu-field-multi-mode">
                多人模式
            </div>
            <br>
            <div class="ac-game-menu-field-item ac-game-menu-field-settings">
                设置
            </div>
        </div>
    </div>`);

        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find(".ac-game-menu-field-single-mode");
        this.$multi_mode = this.$menu.find(".ac-game-menu-field-multi-mode");
        this.$settings = this.$menu.find(".ac-game-menu-field-settings");


        this.start();

    }
    start() {
        this.add_listening_event();
    }
    add_listening_event() {
        let outer = this;
        this.$single_mode.click(function () {
            outer.hide();
            outer.root.playground.show();
            console.log("click single");
        });
        this.$multi_mode.click(function () {
        });
        this.$settings.click(function () {
        });
    }
    show() { // show menu interface
        this.$menu.show();
        // jquery api
    }

    // close menu interface
    hide() {
        this.$menu.hide(); 
    }

}
let Ac_Game_Objects = [];

class AcGameObject {
    constructor() {
        Ac_Game_Objects.push(this);
        console.log(this);
        this.has_called_start = false; // 是否执行过 start 函数
        this.timedelta = 0; //  当前帧距离上一帧的时间间隔
    }

    // 指挥在第一帧执行
    start() {
        console.log("Acgame start");
    }

    update() { // 每一帧均会执行
    }
    on_destroy() { // 在销毁前执行一次

    }
    destroy() { // 删掉该物体
        this.on_destroy();
        for (let i = 0; i < Ac_Game_Objects.length; i++) {
            if (Ac_Game_Objects[i] === this) {
                Ac_Game_Objects.splice(i, 1);
                break;
            }
        }
    }

}

let last_timestamp;

let AC_GAME_ANIMATION = function (timestamp) {
    for (let i = 0; i < Ac_Game_Objects.length; i++) {
        let obj = Ac_Game_Objects[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        }
        else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
        last_timestamp = timestamp;
    }

    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION);
class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas> </canvas>`)
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start() {
        console.log("GameMap start");
    }
    update() {
        this.render();
    }
    render() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
        super();
        this.playground = playground;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.ctx = this.playground.game_map.ctx;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1;
    }
    start() {
        if (this.is_me) {
            this.add_listening_events();
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function () { return false; });
        this.playground.game_map.$canvas.mousedown(function (e) {
            if (e.which === 3) { // 右键
                outer.move_to(e.clientX, e.clientY); 
            }
        });
    }

    move_to(tx, ty) {
        console.log("move to", tx, ty);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.render();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();

    }
}class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);


        console.log("draw a circle");
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.players = [];

        this.game_map = new GameMap(this);
        this.players.push(new Player(this, this.width /2 , this.height / 2, this.height *0.05, "white", this.height*0.15, true));

        this.start();

    }
    start() {

    }
    // open $playground 
    show() {
        this.$playground.show();
    }

    // close $playground
    hide() {
        this.$playground.hide();
    }
}export class AcGame {
    constructor(id) {
        this.id = id;
        this.$ac_game = $('#' + id);
        // this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);

        this.start();
    }
    start() {

    }
}
