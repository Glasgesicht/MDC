<template>
  <div class="mcdpage">
    <div
      class="mcd-wog mcd-s-31 mcd-row-3 logo"
      style="font-size: 28px; background-color: black; font-weight: 500"
    >
      CAS 9-LINE BRIEFING
    </div>
    <div class="mcd-s-4 mcd-row-3 mcd-gow border">TIME<br />STARTED</div>
    <div class="mcd-s-5 mcd-row-3 mcd-gow border"></div>

    <div class="mcd-s-3 mcd-row-3 mcd-gow border">JTAC C/S</div>
    <div class="mcd-s-6 mcd-row-3 mcd-gow border"></div>
    <div class="mcd-s-4 mcd-row-3 mcd-gow border">TIME<br />COMPLETED</div>
    <div class="mcd-s-6 mcd-row-3 mcd-gow border"></div>
    <div
      class="mcd-s-3 mcd-row-3 mcd-gow border lg cBottomLeft"
      style="font-size: 22px"
    >
      F
    </div>
    <div class="mcd-s-4 mcd-row-3 mcd-gow border">WPT</div>
    <div class="mcd-s-6 mcd-row-3 mcd-gow border cTopRight lg">#1</div>
    <div class="mcd-s-6 mcd-row-3 mcd-gow border cTopRight lg">#2</div>
    <div class="mcd-s-6 mcd-row-3 mcd-gow border cTopRight lg">#3</div>
    <div class="mcd-s-6 mcd-row-3 mcd-gow border cTopRight lg">#4</div>
    <div
      class="mcd-s-3 mcd-row-3 mcd-gow border lg cBottomLeft"
      style="font-size: 22px"
    >
      R
    </div>
    <div class="mcd-s-4 mcd-gow mcd-row-3 border">GP / WPN</div>
    <div class="mcd-s-24 mcd-gow mcd-row-3 border"></div>
    <div
      class="mcd-s-3 mcd-gow mcd-row-3 border lg cBottomLeft"
      style="font-size: 22px"
    >
      O
    </div>
    <div class="mcd-s-4 mcd-row-3 mcd-gow border bline">
      TYPE OF<br />CONTROL
    </div>
    <div class="mcd-s-6 mcd-row-3 mcd-gow border bline fix">
      <input type="checkbox" class="checkbox" /> 1
      <input type="checkbox" class="checkbox" /> 2
      <input type="checkbox" class="checkbox" /> 3
    </div>
    <div
      style="font-size: 22px"
      class="mcd-s-3 bline mcd-row-3 mcd-gow border lg"
    >
      BOT
    </div>
    <div
      style="font-size: 22px"
      class="mcd-s-3 bline mcd-row-3 mcd-gow border lg"
    >
      BOC
    </div>
    <div class="mcd-s-5 mcd-row-3 mcd-gow border bline">ABORT CODE</div>
    <div class="mcd-s-7 mcd-row-3 mcd-gow border bline"></div>
    <div
      class="mcd-s-3 mcd-row-3 mcd-gow border lg cBottomLeft"
      style="font-size: 22px"
    >
      T
    </div>
    <div class="mcd-gow mcd-row-2 border topline" style="font-size: 15px">
      1
    </div>
    <div
      class="mcd-s-3 mcd-row-2 mcd-gow border topline"
      style="font-size: 15px"
    >
      IP
    </div>
    <div
      class="mcd-s-24 mcd-row-2 mcd-gow border topline"
      style="font-size: 15px"
    ></div>
    <div
      class="mcd-s-3 mcd-row-3 mcd-gow border lg cBottomLeft"
      style="font-size: 22px"
    >
      I
    </div>
    <div class="mcd-gow mcd-row-2 border" style="font-size: 15px">2</div>
    <div class="mcd-s-3 mcd-row-2 mcd-gow border" style="font-size: 15px">
      HDG
    </div>
    <div
      class="mcd-s-24 mcd-row-2 mcd-gow border cBRight lg"
      style="font-size: 15px"
    >
      MAG/TRUE
    </div>
    <div
      class="mcd-s-3 mcd-row-3 mcd-gow border lg cBottomLeft"
      style="font-size: 22px"
    >
      E
    </div>
    <div class="mcd-gow mcd-row-2 border" style="font-size: 15px">3</div>
    <div class="mcd-s-3 mcd-row-2 mcd-gow border" style="font-size: 15px">
      DISTANCE
    </div>
    <div
      class="mcd-s-24 mcd-row-2 mcd-gow border cBRight lg"
      style="font-size: 15px"
    >
      NM
    </div>

    <div class="mcd-bog mcd-row-3 border" style="font-size: 15px">4</div>
    <div class="mcd-s-3 mcd-row-3 mcd-bog border" style="font-size: 15px">
      TGT ELEV
    </div>
    <div
      class="mcd-s-24 mcd-row-3 mcd-gow border cBRight lg"
      style="font-size: 15px"
    >
      MSL
    </div>
    <div
      class="mcd-s-3 mcd-row-3 mcd-gow border lg cBottomLeft"
      style="font-size: 22px"
    >
      S
    </div>

    <div class="mcd-bow mcd-row-4 border" style="font-size: 15px">5</div>
    <div class="mcd-s-3 mcd-row-4 mcd-bow border" style="font-size: 15px">
      TGT DESC
    </div>
    <div
      class="mcd-s-27 mcd-row-4 mcd-gow border"
      style="font-size: 15px"
    ></div>
    <div class="mcd-bog mcd-row-5 border" style="font-size: 15px">6</div>
    <div class="mcd-s-3 mcd-row-5 mcd-bog border" style="font-size: 15px">
      TGT LOC
    </div>
    <div
      class="mcd-s-27 mcd-row-5 mcd-gow border"
      style="font-size: 15px"
    ></div>
    <div class="mcd-bow mcd-row-3 border" style="font-size: 15px">7</div>
    <div class="mcd-s-3 mcd-row-3 mcd-bow border" style="font-size: 15px">
      TYPE<br />MARK
    </div>
    <div
      class="mcd-s-17 mcd-row-3 mcd-gow border fix"
      style="font-size: 15px; text-align: initial"
    >
      <input type="checkbox" class="checkbox" style="margin-left: 20px" /> WP
      <input type="checkbox" class="checkbox" style="margin-left: 20px" /> LASER
      <input type="checkbox" class="checkbox" style="margin-left: 20px" />
      BEACON
      <input type="checkbox" class="checkbox" style="margin-left: 20px" /> IR
      <input type="checkbox" class="checkbox" style="margin-left: 20px" /> SMOKE
    </div>
    <div
      class="mcd-s-10 mcd-row-3 mcd-bog border lg cBRight"
      style="font-size: 12px"
    >
      LASER CODE
    </div>

    <div class="mcd-bog mcd-row-4 border" style="font-size: 15px">8</div>
    <div class="mcd-s-3 mcd-row-4 mcd-bog border" style="font-size: 15px">
      FRIEND
    </div>
    <div class="mcd-s-27 mcd-row-4 mcd-gow border"></div>

    <div class="mcd-bow mcd-row-3 border bline" style="font-size: 15px">9</div>
    <div class="mcd-s-3 mcd-row-3 mcd-bow border bline" style="font-size: 15px">
      EGRESS
    </div>
    <div
      style="font-size: 16px"
      class="mcd-s-3 mcd-row-3 mcd-gow border bline lg"
    >
      NORTH
    </div>
    <div
      style="font-size: 16px"
      class="mcd-s-3 mcd-row-3 mcd-gow border bline lg"
    >
      EAST
    </div>
    <div
      style="font-size: 16px"
      class="mcd-s-3 mcd-row-3 mcd-gow border bline lg"
    >
      SOUTH
    </div>
    <div
      style="font-size: 16px"
      class="mcd-s-3 mcd-row-3 mcd-gow border bline lg"
    >
      WEST
    </div>
    <div class="mcd-s-15 mcd-row-3 mcd-gow border bline"></div>

    <div class="mcd-s-16 mcd-row-3 mcd-bog border" style="font-size: 24px">
      REMARKS
    </div>
    <div class="mcd-s-15 mcd-row-3 mcd-bog border" style="font-size: 24px">
      BDA / BHA
    </div>
    <div class="mcd-s-16 mcd-row-26 border"></div>
    <div class="mcd-s-1 mcd-row-3 mcd-bog border"></div>
    <div class="mcd-s-2 mcd-row-3 mcd-bog border">HIT</div>
    <div class="mcd-s-2 mcd-row-3 mcd-bow border"></div>
    <div class="mcd-s-2 mcd-row-3 mcd-bog border">MISS</div>
    <div class="mcd-s-2 mcd-row-3 mcd-bow border"></div>
    <div class="mcd-s-2 mcd-row-3 mcd-bog border">NO FX</div>
    <div class="mcd-s-2 mcd-row-3 mcd-bow border"></div>
    <div class="mcd-s-2 mcd-row-3 mcd-bog border"></div>
    <div class="mcd-s-15 mcd-row-26 border"></div>
  </div>
</template>

<style scoped>
.mcdpage {
  grid-template-columns: repeat(31, 1fr);
  grid-template-rows: repeat(69, 1fr);
}

.cTopRight {
  justify-content: flex-end;
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
  color: lightslategray;
}

.bline {
  border-bottom: 3px solid rgb(83, 83, 83);
}

.checkbox {
  height: unset;
  width: unset;
  display: unset;
  margin-top: 13px;
  transform: scale(1.4);
}

.fix {
  align-items: unset;
  display: unset;
  font-size: 18px;
}
</style>

<script setup lang="ts"></script>
