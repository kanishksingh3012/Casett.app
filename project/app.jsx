// app.jsx — device frame, navigation router, persistence.
const { useState:aState, useEffect:aEffect } = React;

const FRESH = () => ({
  title:"", from:"", shell:"graphite", noteFont:"Reenie Beanie",
  stickers:[], hasVoice:false, voiceLen:0, song:null
});

const SEED_LIB = [
  {title:"our long drive home", from:"Maya", to:"Maya", dir:"sent", when:"2d", shell:"amber", noteFont:"Reenie Beanie", stickers:[{key:"heart",top:8,left:78,size:30,rot:12}], song:{title:"Dreams",artist:"Fleetwood Mac",a:"#7b5cff",b:"#2a1a6a"}, hasVoice:true},
  {title:"happy birthday dad", from:"Dad", to:"Dad", dir:"received", when:"5d", shell:"marine", noteFont:"Caveat", stickers:[{key:"star",top:10,left:80,size:26,rot:-10}], song:{title:"Pink Moon",artist:"Nick Drake",a:"#f2b850",b:"#6a4a14"}, hasVoice:true},
];

function App(){
  const [screen,setScreen]=aState(()=>localStorage.getItem("cz_screen")||"home");
  const [tape,setTape]=aState(()=>{ try{return JSON.parse(localStorage.getItem("cz_tape"))||FRESH();}catch(e){return FRESH();} });
  const [lib,setLib]=aState(()=>{ try{return JSON.parse(localStorage.getItem("cz_lib"))||SEED_LIB;}catch(e){return SEED_LIB;} });
  const [viewing,setViewing]=aState(null);
  const [trans,setTrans]=aState("");

  aEffect(()=>localStorage.setItem("cz_screen",screen),[screen]);
  aEffect(()=>localStorage.setItem("cz_tape",JSON.stringify(tape)),[tape]);
  aEffect(()=>localStorage.setItem("cz_lib",JSON.stringify(lib)),[lib]);

  const go=(s)=>{ setTrans("out"); setTimeout(()=>{ setScreen(s); setTrans("in"); setTimeout(()=>setTrans(""),20); },140); };
  const set=(patch)=>setTape(t=>({...t,...patch}));
  const startNew=()=>{ setTape(FRESH()); go("new"); };
  const openTape=(t)=>{ setViewing(t); go("app-player"); };

  const saveTape=()=>{
    const rec={...tape, dir:"sent", to:tape.to||"a friend", when:"now"};
    setLib(l=>[rec,...l]);
    setTape(FRESH());
    go("home");
  };

  let body=null;
  if(screen==="home") body=<Home lib={lib} onNew={startNew} onOpen={openTape} go={go}/>;
  else if(screen==="new") body=<NewTape tape={tape} set={set} onBack={()=>go("home")} onNext={()=>go("record")}/>;
  else if(screen==="record") body=<RecordA tape={tape} set={set} onBack={()=>go("new")} onNext={()=>go("song")}/>;
  else if(screen==="song") body=<AddSongB tape={tape} set={set} onBack={()=>go("record")} onNext={()=>go("customize")}/>;
  else if(screen==="customize") body=<Customize tape={tape} set={set} onBack={()=>go("song")} onNext={()=>go("share")}/>;
  else if(screen==="share") body=<Share tape={tape} onBack={()=>go("customize")} onSave={saveTape} onPreview={()=>{setViewing(tape);go("player");}}/>;
  else if(screen==="app-player") body=<AppPlayer tape={viewing||tape} onBack={()=>go(lib.length?"library":"home")} onShare={()=>go("player")}/>;
  else if(screen==="player") body=<Player tape={viewing||tape} onClose={()=>go("app-player")}/>;
  else if(screen==="library") body=<Library lib={lib} onOpen={openTape} go={go}/>;

  return (
    <div className="room">
      <div className="device">
        <div className="screen-host">
          <div className="island"></div>
          <div className={"screen-slot "+trans}>{body}</div>
        </div>
      </div>
      <button className="reset" onClick={()=>{localStorage.clear();setLib(SEED_LIB);setTape(FRESH());setScreen("home");}}>reset demo</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
