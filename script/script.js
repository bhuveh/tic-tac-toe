var game = [0,0,0,0,0,0,0,0,0];
var moves = 9;

/*Push win conditions.*/
init = function () {
  /*
    Win conditions
    123,147,159,258,357,369,456,789
  */
  var arr = [];
  arr.push([1,1,1,0,0,0,0,0]);
  arr.push([1,0,0,1,0,0,0,0]);
  arr.push([1,0,0,0,1,1,0,0]);
  arr.push([0,1,0,0,0,0,1,0]);
  arr.push([0,0,1,1,1,0,1,0]);
  arr.push([0,0,0,0,0,1,1,0]);
  arr.push([0,1,0,0,1,0,0,1]);
  arr.push([0,0,0,1,0,0,0,1]);
  arr.push([0,0,1,0,0,1,0,1]);
  
  return(arr)
}

/*Reset game, moves, divs.*/
reset = function() {
  game = [0,0,0,0,0,0,0,0,0];
  moves = 9;
  
  $('.game').hide();
  $('.box').html('');
  $('.box').css('color','white');
  
  $('.players').show();
  $('.q1').show();
  $('.a1').show();
  $('.q2').hide();
  $('.a2').hide();
  
  $('.box').off('click');
  $('.a2b').off('click');
  
  console.API;

  if (typeof console._commandLineAPI !== 'undefined') {
    console.API = console._commandLineAPI; //chrome
  } else if (typeof console._inspectorCommandLineAPI !== 'undefined') {
    console.API = console._inspectorCommandLineAPI; //Safari
  } else if (typeof console.clear !== 'undefined') {
    console.API = console;
  }

  console.API.clear();
  
  console.log('Game Reset -> ' + game);
  return;
}

/*Check if box is playable.*/
checkPlay = function(i) {
  if(game[i-1]==0) {
    return true;
  } else {
    return false;
  }
}

/*Increment & decrement probability scores after a move.*/
incr = function(arr, num) {
  /*
    Increase scores based on num.
  */
  var val = 0;
  for(var j = 0; j < arr[num-1].length; j++) {
    if(arr[num-1][j]>0){
      arr[num-1][j]++;
      val = arr[num-1][j];
      for(var i = 0; i < arr.length; i++) {
        if(arr[i][j] > 0) {
          arr[i][j] = val;
        }
      }
    }
  }
  return(arr)
};
decr = function(arr, num) {
  /*
    Decrease scores based on num.
  */
  for(var j = 0; j < arr[num-1].length; j++) {
    if(arr[num-1][j]>0){
      arr[num-1][j] = 0;
      for(var i = 0; i < arr.length; i++) {
        if(arr[i][j] > 0) {
          arr[i][j] = 0;
        }
      }
    }
  }
  return(arr)
};

/*Calculate best move/win probability scores for AI*/
scor = function(mat) {
  var scor = [];
  for(var i = 0; i < mat.length; i++) {
    var sum = mat[i].reduce(function(acc, val) {
      return acc + val;
    }, 0);
    scor.push(sum);
  }
  for (var j = 0; j < game.length; j++) {
    if(game[j] !== 0) {
      scor[j] = 0;
    }
  }
  return scor;
};

/*Get the best move for AI*/
ai = function(xscor, oscor) {
  var max = -1;
  var maxI = -1;
  for (var i = 0; i < 9; i++) {
    if((max < xscor[i] + oscor[i]) && (game[i]===0)) {
      max = xscor[i]+oscor[i];
      maxI = i;
    } else if ((max == xscor[i] + oscor[i]) && (game[i]===0)) {
      if(xscor[i] < oscor[i]) {
        max = xscor[i] + oscor[i];
        maxI = i;
      }
    };
  };
  if(maxI < 0) {
    for (var j = 0; j < 9; j++) {
      if(game[i]===0) {
        maxI = j;
      }
    };
  }
  return maxI;
};
/*Backup dumb AI*/
dumbai = function() {
  var maxI = -1;
  for (var j = 0; j < 9; j++) {
    if(game[i]===0) {
      maxI = j;
    }
  };
  return maxI;
};

/*Check if someone has already won.*/
checkWin = function(arr) {
  /*arr = xmat*/
  var win = [];
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[i].length; j++) {
      if(arr[i][j] == 4) {
        win.push(i);
      }
    }
  }
  console.log('Checking win -> ' + win);
  return win;
};

/*End game.*/
endGame = function(player, win) {
  $('.box').off('click');  
  if (win.length > 0) {
    for(var i = 0; i < win.length; i++) {
      for(var j = 1; j < 10; j++) {
        if(win[i]==j-1) {
          var id = '#b'+j;
          $(id).css('color','#00a300');
        }
      }
    }
  }
  
  var res = ['Draw!','X won!', 'O won!'];
  
  setTimeout(function() {
    if(!alert('Game over! ' + res[player])){
      reset();
    };
  },200);
};

/*Two player.*/
twoP = function() {
  var play = false;
  var isX = true;
  var xmat = init();
  var omat = init();
  
  $('.box').on('click', function() {
    var win = [];
    
    var i = $(this).attr('id');
    i = Number(i.substring(1));
    
    if(checkPlay(i)) {
      if (moves > 0) {
        if(isX) {
          $(this).html('X');
          game[i-1] = 'X';
          console.log('X played -> ' + game);
          
          xmat = incr(xmat,i);
          omat = decr(omat,i);
          
          isX = !isX;
        } else {
          $(this).html('O');
          game[i-1] = 'O';
          console.log('O played -> ' + game);
          
          xmat = decr(xmat,i);
          omat = incr(omat,i);
          
          isX = !isX;
        }
      }
      moves--;
    } else {
      alert("You can't play this box.");
    };
    
    if(moves < 6 && moves >= 0) {
      if(!isX) {
        win = checkWin(xmat);
        if (win.length > 0) {
          console.log('X won. -> ' + win);
          endGame(1, win);
        }
      } else {
        win = checkWin(omat);
        if (win.length > 0) {
          console.log('O won. -> ' + win);
          endGame(2, win);
        }
      }
    } else if (moves < 0){
      console.log('Nobody won. -> Draw');
      endGame(0, []);
    }
  });
};

/*One player.*/
oneP = function(user) {
  var play = false;
  var isX = true;
  var xmat = init();
  var omat = init();
  var xscor = scor(xmat, game);
  var oscor = scor(omat, game);
  
  if(user == 2) {  
    var xMove = ai(oscor, xscor, game) + 1;            
    var box = '#b' + xMove;
    $(box).html('X');
    game[xMove-1] = 'X';
    console.log('X played -> ' + game);
           
    xmat = incr(xmat,xMove);
    omat = decr(omat,xMove);
    
    moves--;
    isX = !isX;
    
    $('.box').on('click', function() {
      var win = [];
    
      var i = $(this).attr('id');
      i = Number(i.substring(1));
        
      if(checkPlay(i)) {
      if (moves > 0) {
        if(!isX) {
          $(this).html('O');
          game[i-1] = 'O';
          console.log('O played -> ' + game);
          
          xmat = decr(xmat,i);
          omat = incr(omat,i);
          xscor = scor(xmat, game);
          oscor = scor(omat, game);
          
          if(moves < 6) {
            win = checkWin(omat);
            if (win.length > 0) {
              console.log('O won. -> ' + win);
              isX = !isX;
              endGame(2, win);              
            }
          }
          
          moves--;
          isX = !isX;
          
          /*X plays*/
          if (moves > 0) {
            if (isX) {
              var xMove = ai(oscor, xscor, game) + 1;
              if(!checkPlay(xMove)) {
                xMove = dumbai(game);
              }
              
              var box = '#b' + xMove;
              $(box).html('X');
              game[xMove-1] = 'X';
              console.log('X played -> ' + game);
              
              xmat = incr(xmat,xMove);
              omat = decr(omat,xMove);
              
              if(moves < 6) {
                win = checkWin(xmat);
                if (win.length > 0) {
                  console.log('X won. -> ' + win);
                  endGame(1, win);
                }
              }
          
              moves--;
              isX = !isX;            
            }
          };            
        }
        /*
          Else, not your move, do not play.
        */
      }
      /*
        No more moves remaining.
      */
      if (moves <= 0) {
        console.log('Nobody won. -> Draw');
        endGame(0, []);
      }
    } else {
        alert("You can't play this box.");
      }
    });
  } 
  else if(user == 1) {
    $('.box').on('click', function() {
      var win = [];
    
      var i = $(this).attr('id');
      i = Number(i.substring(1));
        
      if(checkPlay(i)) {
      if (moves > 0) {
        if(isX) {
          $(this).html('X');
          game[i-1] = 'X';
          console.log('X played -> ' + game);
          
          xmat = incr(xmat,i);
          omat = decr(omat,i);
          xscor = scor(xmat, game);
          oscor = scor(omat, game);
          
          if(moves < 6) {
            win = checkWin(xmat);
            if (win.length > 0) {
              console.log('X won. -> ' + win);
              isX = !isX;
              endGame(1, win);              
            }
          }
          
          moves--;
          isX = !isX;
          
          /*O plays*/
          if (moves > 0) {
            if (!isX) {
              var oMove = ai(xscor, oscor, game) + 1;
              if(!checkPlay(oMove)) {
                oMove = dumbai();
              }
              
              var box = '#b' + oMove;
              $(box).html('O');
              game[oMove-1] = 'O';
              console.log('O played -> ' + game);
              
              xmat = decr(xmat,oMove);
              omat = incr(omat,oMove);
              
              if(moves < 6) {
                win = checkWin(omat);
                if (win.length > 0) {
                  console.log('O won. -> ' + win);
                  endGame(2, win);
                }
              }
          
              moves--;
              isX = !isX;            
            }
          };            
        }
        /*
          Else, not your move, do not play.
        */
      }
      /*
        No more moves remaining.
      */
      if (moves <= 0) {
        console.log('Nobody won. -> Draw');
        endGame(0, []);
      }
    } else {
        alert("You can't play this box.");
      }
    });
  }
};

var main = function() {
  reset();
  $('.a1b').on('click', function() {
    players = Number($(this).html().toString());
    
    if(players==1) {
      $('.q1').hide();
      $('.a1').hide();
      $('.q2').show();
      $('.a2').show();
      $('.a2b').on('click', function() {
        console.log('Clicked a XO button.');
        var char = $(this).html().toString();
        if(char=='O') {
          console.log('Clicked a O button.');
          console.log('Start 1 player.');
          console.log('User is O.');
          $('.players').hide();
          $('.game').fadeIn();
          oneP(2);
        } else {
          console.log('Clicked a X button.');
          console.log('Start 1 player.');
          console.log('User is X.');
          $('.players').hide();
          $('.game').fadeIn();
          oneP(1);
        }
      });
    } else {
      console.log('Start 2 player.');
      $('.players').hide();
      $('.game').fadeIn();
      twoP();
    };
  });
  
  $('.reset').on('click', function() {
    reset();
  });
}

$(document).ready(main);