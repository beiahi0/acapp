class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);


        this.hide();

        this.start();


    }

    get_random_color() {
        let colors = ["blue", "red", "pink", "grey", "green"] ;
        return colors[Math.floor(Math.random() * colors.length)];
    }

    start() {

    }
    // open $playground 
    show() {
        this.$playground.show();
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.players = [];

        this.game_map = new GameMap(this);
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));

        for (let i = 0; i < 5; i++) {
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, this.get_random_color(), this.height * 0.15, false));
        }

    }

    // close $playground
    hide() {
        console.log("this.hide");
        this.$playground.hide();
    }
}
