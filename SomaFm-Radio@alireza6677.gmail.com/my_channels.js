import GObject from "gi://GObject";
import Gio from "gi://Gio";
import St from "gi://St";
import Clutter from "gi://Clutter";

import * as PopupMenu from "resource:///org/gnome/shell/ui/popupMenu.js";

import * as Data from "./data.js";
import { extPath } from "./extension.js";

export const channels = [
    {
        name: "HRINFO",
        link: "https://dispatcher.rndfnk.com/hr/hrinfo/live/mp3/high",
        pic: "/images/hrinfo.png",
        num: 0,
    },
    {
        name: "Metropol FM",
        link: "https://metropol-fm.api.radiosphere.io/audio/0a320c0c-f28c-4a50-bf5f-5dd3d56856ac/stream.mp3",
        pic: "/images/metropol-fm.png",
        num: 1,
    },
];

const holidayChannels = [
    {
        name: "n5MD Radio",
        link: "http://ice4.somafm.com/n5md-128-aac",
        pic: "/images/n5md120.png",
        num: 34,
    },
    {
        name: "Department Store Christmas",
        link: "http://ice4.somafm.com/deptstore-128-aac",
        pic: "/images/deptstore120.jpg",
        num: 35,
    },
    {
        name: "Christmas Lounge",
        link: "http://ice4.somafm.com/christmas-128-aac",
        pic: "/images/christmas120.png",
        num: 36,
    },
    {
        name: "Christmas Rocks!",
        link: "http://ice4.somafm.com/xmasrocks-128-aac",
        pic: "/images/xmasrocks120.png",
        num: 37,
    },
    {
        name: "Xmas in Frisko",
        link: "http://ice4.somafm.com/xmasinfrisko-128-aac",
        pic: "/images/xmasinfrisko120.jpg",
        num: 38,
    },
    {
        name: "Jolly Ol' Soul",
        link: "http://ice4.somafm.com/jollysoul-128-aac",
        pic: "/images/jollysoul120.png",
        num: 39,
    },
    {
        name: "HRINFO",
        link: "https://dispatcher.rndfnk.com/hr/hrinfo/live/mp3/high",
        pic: "/images/hrinfo.png",
        num: 40,
    },
    {
        name: "Metropol FM",
        link: "https://metropol-fm.api.radiosphere.io/audio/0a320c0c-f28c-4a50-bf5f-5dd3d56856ac/stream.mp3",
        pic: "/images/metropol-fm.png",
        num: 41,
    },
];

export const Channel = class Channel {
    constructor(name, link, pic, num, fav) {
        this.name = name;
        this.link = link;
        this.pic = pic;
        this.num = num;
        this.fav = fav;
    }

    getName() {
        return this.name;
    }

    getLink() {
        return this.link;
    }

    getPic() {
        return this.pic;
    }

    getNum() {
        return this.num;
    }

    isFav() {
        return this.fav;
    }

    setFav(f) {
        this.fav = f;
    }
};

export const ChannelBox = GObject.registerClass(
    class ChannelBox extends PopupMenu.PopupBaseMenuItem {
        _init(channel, player, popup) {
            super._init({
                reactive: true,
                can_focus: true,
            });
            this.player = player;
            this.channel = channel;
            this.popup = popup;

            this.vbox = new St.BoxLayout({ vertical: false });
            this.add_child(this.vbox);

            let icon2 = new St.Icon({
                gicon: Gio.icon_new_for_string(extPath + channel.getPic()),
                style: "margin-right:10px",
                icon_size: 60,
            });

            let box2 = new St.BoxLayout({ vertical: false });
            let label1 = new St.Label({
                text: channel.getName(),
                y_align: Clutter.ActorAlign.CENTER,
                y_expand: true,
            });
            this.vbox.add_child(icon2);
            this.vbox.add_child(box2);
            box2.add_child(label1);
        }

        activate(ev) {
            this.player.stop();
            this.player.setChannel(this.channel);
            this.player.play();
            this.popup.channelChanged();
        }
    },
);

export function getChannels() {
    const isDecember = new Date().getMonth() === 11;
    const allChannels = isDecember ? [...channels, ...holidayChannels] : channels;

    return allChannels.map(
        (ch) => new Channel(ch.name, ch.link, ch.pic, ch.num, Data.isFav(ch.num)),
    );
}

export function getFavChannels() {
    return getChannels()
        .filter((ch) => Data.isFav(ch.num))
        .map((ch) => new Channel(ch.name, ch.link, ch.pic, ch.num, true));
}

export function getChannel(index) {
    let item = getChannels()[index] ?? getChannels()[0];
    return new Channel(
        item.name,
        item.link,
        item.pic,
        item.num,
        Data.isFav(item.num),
    );
}
