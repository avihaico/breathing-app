document.addEventListener('DOMContentLoaded', () => {

  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const phase = document.getElementById('phase');
  const core = document.getElementById('core');
  const pulse = document.getElementById('pulse');
  const presets = document.querySelectorAll('.preset');
  const audioToggle = document.getElementById('audioToggle');
  const videoToggle = document.getElementById('videoToggle');
  const bgVideo = document.getElementById('bgVideo');
  const oceanAudio = document.getElementById('oceanAudio');

  let running = false;
  let timer = null;
  let cycle = { inhale:4, inhaleHold:0, exhale:6, exhaleHold:0 };

  function animateVisual(scale, dur){
    core.style.transition = `transform ${dur}s ease-in-out`;
    core.style.transform = `scale(${scale})`;
    pulse.style.transition = `transform ${dur}s linear`;
    pulse.style.transform = `scale(${scale * 0.65})`;
  }

  function setPhaseText(t){ phase.textContent = t; }

  function runCycle(){
    if(!running) return;

    setPhaseText('Inhale');
    animateVisual(1.18, cycle.inhale);

    if(audioToggle.checked){
      oceanAudio.currentTime = 0;
      oceanAudio.play().catch(()=>{});
    }

    timer = setTimeout(() => {
      if(!running) return;
      doExhale();
    }, cycle.inhale * 1000);
  }

  function doExhale(){
    if(!running) return;

    setPhaseText('Exhale');
    animateVisual(0.86, cycle.exhale);

    timer = setTimeout(() => {
      if(!running) return;
      runCycle();
    }, cycle.exhale * 1000);
  }

  startBtn.addEventListener('click', () => {
    if(!running){
      running = true;
      startBtn.textContent = 'Pause';
      stopBtn.disabled = false;

      if(videoToggle.checked){
        bgVideo.play().catch(()=>{});
      }

      runCycle();
    } else {
      running = false;
      startBtn.textContent = 'Start';
      clearTimeout(timer);
      animateVisual(1, 0.2);
      oceanAudio.pause();
      setPhaseText('Paused');
    }
  });

  stopBtn.addEventListener('click', () => {
    running = false;
    clearTimeout(timer);
    animateVisual(1,0.2);
    oceanAudio.pause();
    oceanAudio.currentTime = 0;
    startBtn.textContent = 'Start';
    stopBtn.disabled = true;
    setPhaseText('Ready');
  });

  presets.forEach(p => {
    p.addEventListener('click', () => {
      cycle = {
        inhale: +p.dataset.in,
        inhaleHold: +p.dataset.holdin,
        exhale: +p.dataset.ex,
        exhaleHold: +p.dataset.holdex
      };
      setPhaseText(p.textContent);
    });
  });

  videoToggle.addEventListener('change', () => {
    if (videoToggle.checked) {
      bgVideo.style.display = '';
      bgVideo.play().catch(err => {
        console.error('Failed to play video:', err);
        // If autoplay failed, show a play button
        const playBtn = document.createElement('button');
        playBtn.textContent = 'Click to enable video';
        playBtn.style.position = 'fixed';
        playBtn.style.top = '50px';
        playBtn.style.left = '10px';
        playBtn.style.zIndex = '1000';
        playBtn.onclick = () => {
          bgVideo.play().finally(() => {
            if (document.body.contains(playBtn)) {
              document.body.removeChild(playBtn);
            }
          });
        };
        document.body.appendChild(playBtn);
      });
    } else {
      bgVideo.style.display = 'none';
      bgVideo.pause();
    }
  });

});
