function decreaseTimer(){
    if(time>0){
        timerId=setTimeout(decreaseTimer,1000)
        timer.innerHTML=time
        time--
    }else{
        determineWinner()
    }
}