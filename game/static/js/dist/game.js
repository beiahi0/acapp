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
    }
    last_timestamp = timestamp;

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
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.move_length = 0;
        this.ctx = this.playground.game_map.ctx;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1;
        this.cur_skill = null;

        this.friction = 0.9; // 被击中后退速度会衰减

    }
    start() {
        if (this.is_me) {
            this.add_listening_events();
        } else {
            // 敌人
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
            // console.log(tx, ty);
        }

    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function() { return false; });
        this.playground.game_map.$canvas.mousedown(function(e) {
            if (e.which === 3) { // 右键
                outer.move_to(e.clientX, e.clientY);
            } else if (e.which === 1) { // 左键
                if (outer.cur_skill === "fireball") {
                    outer.shoot_fireball(e.clientX, e.clientY);
                }

                outer.cur_skill = null;
            }
        });

        $(window).keydown(function(e) {
            if (e.which === 81) {// q 
                outer.cur_skill = "fireball";
                return false;
            }
        });
    }

    shoot_fireball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height;
        new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, this.playground.height * 0.01);
        console.log("fire ball");
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    is_attacked(angle, damage) {
        this.radius -= damage;
        if (this.radius < 10) {
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100;
        this.speed *= 0.8;
    }

    update() {
        if (this.damage_speed > 10) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;

        }

        if (this.move_length < this.eps) {
            this.move_length = 0;
            this.vx = this.vy = 0;
            if (!this.is_me) {
                let tx = Math.random() * this.playground.width;
                let ty = Math.random() * this.playground.height;
                this.move_to(tx, ty);
            }
        }
        else {
            this.moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
            this.x += this.vx * this.moved;
            this.y += this.vy * this.moved;
            this.move_length -= this.moved;
        }
        this.render();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();

    }
}
class FireBall extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_lengh, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.radius = radius;
        this.speed = speed;
        this.move_lengh = move_lengh;
        this.damage = damage;
        this.eps = 0.1;
    }
    start() {

    }
    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }


    update() {
        if (this.move_lengh < this.eps) {
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_lengh, this.speed * this.timedelta / 1000);


        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_lengh -= moved;

        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
            }
        }

        this.render();
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2, dy = y1 - y2;
        return Math.sqrt(dx * dx + dy* dy);
    }

    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < this.radius + player.radius) {
            return true;
        }
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);
        this.destroy();
    }


}
class AcGamePlayground {
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

        for (let i = 0; i < 5; i++) {
            this.players.push(new Player(this, this.width /2 , this.height / 2, this.height *0.05, "blue", this.height*0.15, false));
        }

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
}
export class AcGame {
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
