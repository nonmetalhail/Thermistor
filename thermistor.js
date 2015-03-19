var cC,cB;

$(document).ready(function(){
  $('#calcABC').on('click',function(e){
    var r1,r2,r3,t1,t2,t3;

    r1 = parseFloat($('#R1').val());
    r2 = parseFloat($('#R2').val());
    r3 = parseFloat($('#R3').val());

    if(document.getElementById("dC").checked){
      t1 = Kelvin(parseFloat($('#T1').val()));
      t2 = Kelvin(parseFloat($('#T2').val()));
      t3 = Kelvin(parseFloat($('#T3').val()));
    }
    else{
      t1 = Kelvin(Celcius(parseFloat($('#T1').val())));
      t2 = Kelvin(Celcius(parseFloat($('#T2').val())));
      t3 = Kelvin(Celcius(parseFloat($('#T3').val()))); 
    }

    cC = new calcCoefficients(r1,r2,r3,t1,t2,t3);
    $('#A').val(cC.A);
    $('#B').val(cC.B);
    $('#C').val(cC.C);
    e.preventDefault();
  });

  $('#calcT').on('click',function(e){
    var A,B,C,R;

    A = parseFloat($('#tA').val());
    B = parseFloat($('#tB').val());
    C = parseFloat($('#tC').val());
    R = parseFloat($('#tR').val());

    var cT = calcTemperature(A,B,C,R);
    document.getElementById("tdC").checked ? $('#tT').val(KtoC(cT)) : $('#tT').val(CtoF(KtoC(cT)));
    e.preventDefault();
  });

  $("#tdC").on('change',function(e){
    $('#tT').val(Celcius($('#tT').val()));
    e.preventDefault();
  });
  $("#tdF").on('change',function(e){
    $('#tT').val(CtoF($('#tT').val()));
  e.preventDefault();
  });

  $('#tImport').on("click",function(e){
    $('#tA').val(cC.A);
    $('#tB').val(cC.B);
    $('#tC').val(cC.C);
    e.preventDefault();
  });

$('#calcR').on('click',function(e){
    var A,B,C,T;

    A = parseFloat($('#rA').val());
    B = parseFloat($('#rB').val());
    C = parseFloat($('#rC').val());
    T = document.getElementById("rdC").checked ? Kelvin(parseFloat($('#rT').val())) : Kelvin(Celcius(parseFloat($('#rT').val())));

    var cR = calcResistance(A,B,C,T);
    $('#rR').val(cR);
    e.preventDefault();
  });

  $('#rImport').on("click",function(e){
    $('#rA').val(cC.A);
    $('#rB').val(cC.B);
    $('#rC').val(cC.C);
    e.preventDefault();
  });
  
  $('#calcBeta').on('click',function(e){
    var r1,r2,t1,t2;

    r1 = parseFloat($('#bR1').val());
    r2 = parseFloat($('#bR2').val());

    if(document.getElementById("bdC").checked){
      t1 = Kelvin(parseFloat($('#bT1').val()));
      t2 = Kelvin(parseFloat($('#bT2').val()));
    }
    else{
      t1 = Kelvin(Celcius(parseFloat($('#bT1').val())));
      t2 = Kelvin(Celcius(parseFloat($('#bT2').val())));
    }

    cB = new calcBeta(r1,r2,t1,t2);
    $('#Beta').val(cB.Beta);
    e.preventDefault();
  });

  $('#calcTB').on('click',function(e){
    var b,r0,r,t0;

    b = parseFloat($('#btBeta').val());
    r0 = parseFloat($('#btR0').val());
    r = parseFloat($('#btR').val());

    t0 = document.getElementById("btdC").checked ? Kelvin(parseFloat($('#btT0').val())) : Kelvin(Celcius(parseFloat($('#btT0').val())));

    var T_B = calcTB(b,t0,r0,r);
    document.getElementById("btdC").checked ? $('#btT').val(KtoC(T_B)) : $('#btT').val(CtoF(KtoC(T_B)));
    e.preventDefault();
  });

  $('#calcRB').on('click',function(e){
    var b,r0,t0,t;

    b = parseFloat($('#brBeta').val());
    r0 = parseFloat($('#brR0').val());

    if(document.getElementById("brdC").checked){
      t0 = Kelvin(parseFloat($('#brT0').val()));
      t = Kelvin(parseFloat($('#brT').val()));
    }
    else{
      t0 = Kelvin(Celcius(parseFloat($('#brT0').val())));
      t = Kelvin(Celcius(parseFloat($('#brT').val())));
    }

    var R_B = calcRB(b,t0,t,r0);
    $('#brR').val(R_B);
    e.preventDefault();
  });
});

function Kelvin(dC){ return dC + 273.15; }

function Celcius(dF){ return (dF-32)*5/9; }

function KtoC(dK){ return dK - 273.15; }

function CtoF(dC){ return (dC*9/5)+32; }

var calcCoefficients = function(R1,R2,R3,T1,T2,T3){
  function __L(R){ return Math.log(R); }
  function __Y(T){ return 1/T; }
  function __gamma(y1,y2,l1,l2){ return(y2-y1)/(l2-l1); }

  this.C = ((__gamma(__Y(T1),__Y(T3),__L(R1),__L(R3)) - __gamma(__Y(T1),__Y(T2),__L(R1),__L(R2)))/(__L(R3) - __L(R2))) * (1/(__L(R1) + __L(R2) + __L(R3)));
  this.B = __gamma(__Y(T1),__Y(T2),__L(R1),__L(R2)) - (this.C * ((__L(R1)*__L(R1)) + __L(R1)*__L(R2) + (__L(R2)*__L(R2))));
  this.A = __Y(T1) - (this.B + (__L(R1)*__L(R1)) * this.C) * __L(R1);
}

function calcTemperature(A,B,C,R){
  return 1/(A + B * Math.log(R) + C * Math.pow(Math.log(R),3));
}

function calcResistance(A,B,C,T){
  var y = (A - (1/T))/C;
  var x = Math.sqrt( Math.pow(B/(3*C),3) + (y*y)/4 );
  return Math.exp( Math.pow((x-(y/2)),1/3) - Math.pow((x+(y/2)),1/3) );
}

var calcBeta = function(R0,R1,T0,T1){
  this.Beta = Math.log(R1/R0)/(1/T1 - 1/T0);
}

function calcTB(Beta,T0,R0,R){
  return 1/(1/T0 + Math.log(R/R0)/Beta);
}

function calcRB(Beta,T0,T,R0){
  return R0 * Math.exp(Beta*(1/T-1/T0));
}