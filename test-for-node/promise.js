// 注意：若 promise 还有新增的有意义的面试题，需要增加 promise usages 目录，每个面试题单独放置在一个文件中，方便调试
/**
 * 面试题：实现一个 scheduler.add方法，模拟一个异步串行队列，最大并发数是2
 *
 * 题意理解：
 *  异步任务按照插入顺序同步执行；
 *  最多有 2 个异步任务异步执行
 *
 * 期望输出结果：
 *  2s 后输出 1；
 *  5s 后输出 3；（2 + 3）
 *  6s 后输出 2；
 *  13s 后输出 4；（5 + 8）
 */
function Scheduler(maxSize) {
  this.count = 0;
  this.waiting = [];
  this.maxSize = maxSize || 1;
}

Scheduler.prototype.finish = function () {
  this.count--;
  if (this.count < this.maxSize) {
    this.run();
  }
};

Scheduler.prototype.run = function () {
  console.log(this);
  const task = this.waiting.shift();
  task(this.finish.bind(this));
};

Scheduler.prototype.add = function (cb) {
  this.waiting.push(cb);
  this.count++;
  this.run();
};

function addTask(delay, data) {
  const scheduler = new Scheduler(2);
  scheduler.add(function () {
    setTimeout(() => {
      console.log(data);
    }, delay);
  });
}

addTask(2000, "1");
addTask(6000, "2");
addTask(3000, "3");
addTask(8000, "4");
