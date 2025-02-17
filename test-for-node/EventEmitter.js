const EventEmitter = function () {
  this.eventList = {};
};

EventEmitter.validateName = function (eventName) {
  if (typeof eventName !== "string") {
    console.log(
      "the typeof eventName expect a string but accepted ",
      typeof eventName
    );
    return false;
  }
  return true;
};
EventEmitter.validateList = function (list) {
  if (!list?.length) {
    console.log("there is no subscriber on event ", eventName);
    return false;
  }
  return true;
};
EventEmitter.prototype.on = function (eventName, callback) {
  EventEmitter.validateName(eventName);
  const list = this.eventList[eventName] || [];
  list.push(callback);
  this.eventList[eventName] = list;
};

EventEmitter.prototype.remove = function (eventName, callback) {
  EventEmitter.validateName(eventName);
  const list = this.eventList[eventName];
  if (!EventEmitter.validateList(list)) {
    return;
  }
  this.eventList[eventName] = list.filter((cb) => cb !== callback);
};

EventEmitter.prototype.dispatch = function (eventName, arg) {
  EventEmitter.validateName(eventName);
  const list = this.eventList[eventName];
  if (!EventEmitter.validateList(list)) {
    return;
  }
  list.forEach((cb) => cb(arg));
  this.eventList[eventName] = this.eventList[eventName].filter(
    (cb) => !cb.shouldOnce
  );
};

EventEmitter.prototype.once = function (eventName, callback) {
  EventEmitter.validateName(eventName);
  callback.shouldOnce = true;
  this.on(eventName, callback);
};

const testEventEmitter = () => {
  const emitter = new EventEmitter();

  emitter.on("event-01", () => {
    console.log("event-01 cb-01 called");
  });
  emitter.once("event-01", () => {
    console.log("event-01 cb-03 called");
  });

  const cb02 = () => {
    console.log("event-01 cb-02 called");
  };

  emitter.on("event-01", cb02);

  emitter.dispatch("event-01");

  emitter.remove("event-01", cb02);
  console.log("dispatch after remove cb02");
  emitter.dispatch("event-01");
};

const testEventEmitterWithOtherClass = () => {
  const MakeNoise = function () {
    this.noise = 0;
    this.emitter = new EventEmitter();
  };
  MakeNoise.prototype.inc = function () {
    this.change(this.noise + 1);
  };
  MakeNoise.prototype.des = function () {
    this.change(this.noise - 1);
  };
  MakeNoise.prototype.change = function (noise) {
    this.noise = noise < 0 ? 0 : noise;
    console.log(noise);
    if (noise > 5) {
      this.emitter.dispatch("noise", {
        level: "crazy",
      });
      return;
    }
    if (noise > 3) {
      this.emitter.dispatch("noise", {
        level: "annoyed",
      });
      return;
    }

    if (noise > 0) {
      this.emitter.dispatch("noise", {
        level: "normal",
      });
    }
  };
  MakeNoise.prototype.on = function () {
    return this.emitter.on(...arguments);
  };
  MakeNoise.prototype.remove = function () {
    return this.emitter.remove(...arguments);
  };

  const makeNoise = new MakeNoise();
  makeNoise.on("noise", function ({ level }) {
    if (level !== "normal") {
      return;
    }
    console.log(level);
  });
  makeNoise.on("noise", function ({ level }) {
    if (level !== "crazy") {
      return;
    }
    console.log(level);
  });
  const annoyed = function ({ level }) {
    if (level !== "annoyed") {
      return;
    }
    console.log(level);
  };
  makeNoise.on("noise", annoyed);

  // 应该输出 normal
  makeNoise.inc();
  makeNoise.inc();
  makeNoise.inc();
  // 应该输出 annoyed
  makeNoise.inc();
  makeNoise.inc();
  // 应该输出 crazy
  makeNoise.inc();
  // 应该输出 annoyed
  makeNoise.des();

  makeNoise.remove("noise", annoyed);
  // 应该不输出
  makeNoise.des();
};

const testWithinEventTarget = () => {
  const MakeNoise = function () {
    const _this = this;
    this.noise = 0;
    this.emitter = new EventEmitter();
    this.event = {
      noise: _this.noise,
    };
  };
  MakeNoise.prototype.inc = function () {
    this.change(this.noise + 1);
  };
  MakeNoise.prototype.des = function () {
    this.change(this.noise - 1);
  };
  MakeNoise.prototype.change = function (noise) {
    const _this = this;
    this.noise = noise < 0 ? 0 : noise;
    this.event.noise = noise;
    console.log(noise);
    if (noise > 5) {
      this.emitter.dispatch("noise", {
        level: "crazy",
        target: _this.event,
      });
      return;
    }
    if (noise > 3) {
      this.emitter.dispatch("noise", {
        level: "annoyed",
        target: _this.event,
      });
      return;
    }

    if (noise > 0) {
      this.emitter.dispatch("noise", {
        level: "normal",
        target: _this.event,
      });
    }
  };
  MakeNoise.prototype.on = function () {
    return this.emitter.on(...arguments);
  };
  MakeNoise.prototype.remove = function () {
    return this.emitter.remove(...arguments);
  };

  const makeNoise = new MakeNoise();
  makeNoise.on("noise", function ({ level, target }) {
    console.log("from target: ", target.noise);
    if (level !== "normal") {
      return;
    }
    console.log(level);
  });

  // 应该输出 normal
  makeNoise.inc();
  makeNoise.inc();
};

testEventEmitter();
testEventEmitterWithOtherClass();
testWithinEventTarget();
