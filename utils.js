module.exports = {
  randomString(length = 3) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
  commonCommand: {
    clickElement(input) {
      return this.click(input);
    },
    setInput(input, value) {
      return this.setValue(input, value);
    },
    clearInput(input) {
      return this.clearValue(input);
    },
    moveToEl(el) {
      return this.moveToElement(el, 10, 10);

    }
  },
  secondsToHms(d) {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);

    const hDisplay = h > 9 ? h : `0${h}`;
    const mDisplay = m > 9 ? m : `0${m}`;
    const sDisplay = s > 9 ? s : `0${s}`;
    return `${hDisplay}:${mDisplay}:${sDisplay}`;
  },
  emojiUnicode(emoji) {
    let comp;
    if (emoji.length === 1) {
      comp = emoji.charCodeAt(0);
    }
    comp = (
      (emoji.charCodeAt(0) - 0xD800) * 0x400 +
      (emoji.charCodeAt(1) - 0xDC00) + 0x10000
    );
    if (comp < 0) {
      comp = emoji.charCodeAt(0);
    }
    return 'U+' + comp.toString('16').toUpperCase();
  },
  renderMsgForWaitElement(not) {
    return `Testing if element %s was ${not ? 'hided': 'visible'} after %d ms`;
  }
};
