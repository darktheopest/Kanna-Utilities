export default function createBar(input: { total: number, current: number }) {
    const slider = '\u2588'
    const line = '\u2591'
    const percentage = input.current / input.total
    const progress = Math.round((10 * percentage))
    const emptyProgress = 10 - progress
    const progressText = line.repeat(progress).replace(/.$/, slider)
    const emptyProgressText = line.repeat(emptyProgress)
    const bar = progressText.replaceAll(line, slider) + emptyProgressText
    const calculated = percentage * 100
    return [bar, calculated.toFixed(2)]
}
