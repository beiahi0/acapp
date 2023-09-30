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
