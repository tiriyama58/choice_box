/** 当選セグメントの中心が上向きポインターに来る回転角（0–360°） */
export function rotationModForWinner(
  winnerIndex: number,
  segmentCount: number,
): number {
  if (segmentCount <= 0) {
    return 0;
  }
  const segmentAngle = 360 / segmentCount;
  const centerAngle = (winnerIndex + 0.5) * segmentAngle;
  return (360 - centerAngle + 360) % 360;
}

/**
 * 現在の回転角から、減速して当選インデックスで止まる目標回転角（累積・常に前進）。
 */
export function computeSpinRotation(
  currentRotation: number,
  winnerIndex: number,
  segmentCount: number,
  minFullRotations = 5,
): number {
  if (segmentCount <= 0) {
    return currentRotation;
  }
  const targetMod = rotationModForWinner(winnerIndex, segmentCount);
  const currentMod = ((currentRotation % 360) + 360) % 360;
  let delta = targetMod - currentMod;
  if (delta <= 0) {
    delta += 360;
  }
  return currentRotation + minFullRotations * 360 + delta;
}
