export const INITIALS = [
  'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h',
  'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w'
]

export const FINALS = [
  'a', 'o', 'e', 'i', 'u', 'ü',
  'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong',
  'ia', 'ie', 'iao', 'iou', 'ian', 'in', 'iang', 'ing', 'iong',
  'ua', 'uo', 'uai', 'uei', 'uan', 'uen', 'uang', 'ueng',
  'üe', 'üan', 'ün'
]

export const TONES = [
  { value: 1, label: 'ā', display: '第一声' },
  { value: 2, label: 'á', display: '第二声' },
  { value: 3, label: 'ǎ', display: '第三声' },
  { value: 4, label: 'à', display: '第四声' },
]

export function validatePinyin(pinyin: string, tone: number): boolean {
  // 验证拼音是否有效
  const pinyinRegex = /^[a-zü]+$/
  return pinyinRegex.test(pinyin) && tone >= 1 && tone <= 4
}

export function formatPinyin(pinyin: string, tone: number): string {
  // 将拼音和声调组合成带声调的拼音
  const toneMap: Record<number, string> = {
    1: 'ā', 2: 'á', 3: 'ǎ', 4: 'à'
  }
  // 简单实现：实际应该根据声调规则放置声调符号
  return pinyin + (toneMap[tone] || '')
}
