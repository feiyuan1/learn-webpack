function case1(){
  var box1Height = document.getElementById('box1').clientHeight;
  document.getElementById('box1').style.height = box1Height + 10 + 'px';

  var box2Height = document.getElementById('box2').clientHeight;
  document.getElementById('box2').style.height = box2Height + 10 + 'px';

  var box3Height = document.getElementById('box3').clientHeight;
  document.getElementById('box3').style.height = box3Height + 10 + 'px';

  var box4Height = document.getElementById('box4').clientHeight;
  document.getElementById('box4').style.height = box4Height + 10 + 'px';

  var box5Height = document.getElementById('box5').clientHeight;
  document.getElementById('box5').style.height = box5Height + 10 + 'px';

  var box6Height = document.getElementById('box6').clientHeight;
  document.getElementById('box6').style.height = box6Height + 10 + 'px';
}

function case2(){
  var box1Height = document.getElementById('box1').clientHeight;
  var box2Height = document.getElementById('box2').clientHeight;
  var box3Height = document.getElementById('box3').clientHeight;
  var box4Height = document.getElementById('box4').clientHeight;
  var box5Height = document.getElementById('box5').clientHeight;
  var box6Height = document.getElementById('box6').clientHeight;

  document.getElementById('box1').style.height = box1Height + 10 + 'px';
  document.getElementById('box2').style.height = box2Height + 10 + 'px';
  document.getElementById('box3').style.height = box3Height + 10 + 'px';
  // console.log(document.body.clientHeight) // 似乎会中断渲染？导致触发两次重排
  document.getElementById('box4').style.height = box4Height + 10 + 'px';
  document.getElementById('box5').style.height = box5Height + 10 + 'px';
  document.getElementById('box6').style.height = box6Height + 10 + 'px';
}

function case3(){
  // console.log(document.getElementById('box1').getBoundingClientRect().top)
  // console.log(document.getElementById('box2').clientHeight)
  // document.getElementById('box3').style.color = 'red'
  document.body.clientHeight
}

function case4(){
  const box = document.getElementById('box1')
  box.style.display = 'none'
}

document.getElementsByTagName('button')[0].onclick = function(){
  // case1()
  case2()
  // case3()
  // case4()
}