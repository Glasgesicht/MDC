<template>
  <div class="mcdpage">
    <div
      class="mcd-wog mcd-s-30 mcd-row-3 logo"
      style="font-size: 28px; font-weight: 500"
    >
      CAS CHECK-IN
    </div>
    <div class="mcd-s-10 mcd-row-3 mcd-bow border descr cBRight lg">JTAC</div>
    <div class="mcd-s-10 mcd-row-3 mcd-bow border descr cBRight lg">RAMROD</div>
    <div class="mcd-s-10 mcd-row-3 mcd-bow border descr cBRight lg">
      AUTHENTICATION/MATRIX
    </div>

    <div class="mcd-s-5 mcd-row-3 mcd-bog border">1. MSN Nr.</div>
    <div class="mcd-s-10 mcd-row-3 mcd-bow border descr cBRight lg"></div>
    <div class="mcd-s-5 mcd-row-6 mcd-bog border blt blb">5. Ordnance</div>
    <div class="mcd-s-10 mcd-row-6 mcd-bow descr border cBRight blt blb blr lg">
      Type and L-Code
    </div>

    <div class="mcd-s-5 mcd-row-3 mcd-bog border">2. Nr. + Type A/C</div>
    <div class="mcd-s-10 mcd-row-3 mcd-bow border"></div>

    <div class="mcd-s-5 mcd-row-3 mcd-bog border">3. Position & Alt</div>
    <div class="mcd-s-10 mcd-row-3 mcd-bow border"></div>
    <div class="mcd-s-5 mcd-row-6 mcd-bog border bline">6. Capabilities</div>
    <div class="mcd-s-10 mcd-row-6 mcd-bow border descr cBRight lg bline">
      L16, TGP, NVG etc
    </div>

    <div class="mcd-s-5 mcd-row-3 mcd-bog border bline">4. Playtime / TOS</div>
    <div class="mcd-s-10 mcd-row-3 mcd-bow border descr cBRight lg bline">
      In Hours + Minutes
    </div>

    <div class="mcd-s-5 mcd-row-3 mcd-bog border">HOLD</div>
    <div class="mcd-s-10 mcd-row-3 mcd-bow border"></div>
    <div class="mcd-s-5 mcd-row-3 mcd-bog border">ALT</div>
    <div class="mcd-s-10 mcd-row-3 mcd-bow border"></div>

    <div
      class="mcd-wog mcd-s-30 mcd-row-2"
      style="font-size: 22px; font-weight: 500"
    >
      SITREP
    </div>

    <div class="mcd-s-5 mcd-row-4 mcd-bog border">COMMANDERS<br />INTENT</div>
    <div class="mcd-s-19 mcd-row-4 mcd-bow dottetBottom blt bright"></div>
    <div class="mcd-s-3 mcd-row-4 mcd-bog border blb2">SITREP<br />UPDATE</div>
    <div class="mcd-s-3 mcd-row-4 mcd-bow border blb2"></div>
    <div class="mcd-s-5 mcd-row-4 mcd-bog border">TARGET</div>
    <div class="mcd-s-25 mcd-row-4 mcd-bow dottetBottom"></div>
    <div class="mcd-s-5 mcd-row-4 mcd-bog border">FRIENDLIES</div>
    <div class="mcd-s-25 mcd-row-4 mcd-bow dottetBottom"></div>
    <div class="mcd-s-5 mcd-row-4 mcd-bog border">ARTILLERY<br />ACTIVITY</div>
    <div class="mcd-s-25 mcd-row-4 mcd-bow dottetBottom"></div>
    <div class="mcd-s-5 mcd-row-4 mcd-bog border">CLEARANCE<br />AUTHORITY</div>
    <div class="mcd-s-25 mcd-row-4 mcd-bow dottetBottom"></div>
    <div class="mcd-s-5 mcd-row-4 mcd-bog border">ORDNANCE</div>
    <div class="mcd-s-25 mcd-row-4 mcd-bow dottetBottom"></div>
    <div class="mcd-s-5 mcd-row-4 mcd-bog border">RESTRICTIONS</div>
    <div class="mcd-s-25 mcd-row-4 mcd-bow blb"></div>
    <div class="mcd-s-5 mcd-row-8 mcd-bog border">
      HAZARDS & <br />
      REMARKS
    </div>
    <div class="mcd-s-25 mcd-row-4 mcd-bow blt"></div>
    <div class="mcd-s-25 mcd-row-4 mcd-bow blb"></div>
    <div
      class="mcd-s-30 mcd-row-10 mcd-bow blt cTopLeft lg"
      style="padding: 5px; font-size: 19px"
    >
      ADDITIONAL<br />NOTES
    </div>
  </div>
</template>

<style scoped>
.mcdpage {
  grid-template-columns: repeat(30, 1fr);
  grid-template-rows: repeat(69, 1fr);
}

.cTopRight {
  justify-content: flex-end;
  flex-direction: inherit;
  align-items: baseline;
}

.cTopLeft {
  justify-content: flex-start;

  text-align: start;
  flex-direction: inherit;
  align-items: baseline;
}

.cBRight {
  justify-content: flex-end;
  flex-direction: inherit;
  align-items: end;
}

.cBottomLeft {
  justify-content: flex-start;
  flex-direction: inherit;
  align-items: end;
}

.lg {
  color: rgba(131, 131, 131, 0.8);
}

.bline {
  border-bottom: 3px solid rgb(0, 0, 0);
}
.blb {
  border-bottom: 1px solid black;
}

.blb2 {
  border-bottom: 2px solid black;
}
.blt {
  border-top: 1px solid black;
}
.bll {
  border-left: 1px solid black;
}
.blr {
  border-right: 1px solid black;
}
.tline {
  border-top: 3px solid rgb(0, 0, 0);
}

.bright {
  border-right: 1px solid rgb(0, 0, 0);
}

.checkbox {
  height: unset;
  width: unset;
  display: unset;
  margin-top: 13px;
  transform: scale(1.4);
}

.dottetTop {
  border-top: 1px dashed black;
}

.dottetBottom {
  border-bottom: 1px dashed black;
}

.fix {
  align-items: unset;
  display: unset;
  font-size: 18px;
}

.descr {
  text-align: left;
  height: unset;
  width: unset;
  font-size: 10px;
}
</style>
