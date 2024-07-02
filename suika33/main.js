import { FRUITS } from "/suika33/fruits.js";

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World,
    Body = Matter.Body,
    Events = Matter.Events;

    // 엔진 선언
const engine = Engine.create();

// 렌더 선언
const render = Render.create({
    engine,
    element : document.body,
    options: {
        wireframes : false, // true면 배경색 적용안됨
        background : '#F7F4C8', // 배경
        width : 620,
        height : 850,
    }
});

const world = engine.world;

// 왼쪽 벽 생성
const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic : true,  // 고정해주는 기능
    render : { fillStyle : '#E6B143'}  // 색상 지정
})

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
    isStatic : true,  // 고정해주는 기능
    render : { fillStyle : '#E6B143'}  // 색상 지정
})

const ground = Bodies.rectangle(310, 820, 620, 60, {
    isStatic : true,  // 고정해주는 기능
    render : { fillStyle : '#E6B143'}  // 색상 지정
})

const topline = Bodies.rectangle(310, 150, 620, 2, {
    isStatic : true,  // 고정해주는 기능
    isSensor : true,
    render : { fillStyle : '#E6B143'}  // 색상 지정
})

// 벽 배치
World.add(world, [leftWall, rightWall, ground, topline]);

Render.run(render);
Runner.run(engine);

// 과일 떨어지는 함수 만들기
function addFruit() {
   
    // 과일 index 저장
    const index = 0;

    const fruit = FRUITS[index];

    console.log(fruit.index)

    const body = Bodies.circle(300, 50, fruit.radius, {
        index : index,
        isSleeping : true,
             render : {
                sprite : { texture : `${fruit.name}.png`},
                              // texture : fruit.name + `.png` {,}
             }
    })

    World.add(world, body);
}


window.onkeydown = (event) =>{

    //제어 조작 변수가 true 경우 바로 리턴
    if(disableAction)
        return

    switch(event.code){
        case "KeyA":
            Body.setPosition(currentBody,{
                x: currentBody.position.x - 10,
                y: currentBody.position.y
            })
            break;
        case "KeyD":
            Body.setPosition(currentBody,{
                x: currentBody.position.x + 10,
                y: currentBody.position.y
            })
            break;
        case "KeyS":
            currentBody.isSleeping = false;
            disableAction = true;
            setTimeout(()=>{
                addFruit();
                disableAction = false;
            },1000)
            break;
    }
}

Events.on(engine, "collisionStart", (event) => {
    //콜리전 이벤트 발생시 생기는 모든 오브젝트를 비교
    event.pairs.forEach((collision) => {
        if (collision.bodyA.index == collision.bodyB.index) {

            // 기존 과일의 index를 저장
               const index = collision.bodyA.index;

            // 충돌이 일어나는 같은 과일 제거
               World.remove(world, [collision.bodyA, collision.bodyB]);

            // 기존 과일에서 1 증가 시킨 값을 저장
            const newFruit = FRUITS[index + 1];
            const newBody = Bodies.circle(
                // 부딫친 위치의 x,y 값
                collision.collision.supports[0].x,
                collision.collision.supports[0].y,
                newFruit.radius,
                {
                    // 과일 index 저장
                    index : index + 1,
                    // 새로운 과일 렌더링
                    render : { sprite : { textture : `${newFruit.name}.png` }},
                }
            );

            World.add(world, newBody);

        }
    })

})

addFruit();