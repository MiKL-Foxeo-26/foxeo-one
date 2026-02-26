'use client'

interface ElioTemperatureSliderProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export function ElioTemperatureSlider({ value, onChange, disabled }: ElioTemperatureSliderProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Température :{' '}
          <span className="font-mono text-primary">{value.toFixed(1)}</span>
        </label>
      </div>
      <p className="text-xs text-muted-foreground">
        Plus élevé = plus créatif. Plus bas = plus déterministe.
      </p>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-8">0.0</span>
        <input
          type="range"
          min={0}
          max={2}
          step={0.1}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          disabled={disabled}
          className="flex-1 h-2 appearance-none rounded-full bg-muted cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50"
        />
        <span className="text-xs text-muted-foreground w-8">2.0</span>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground px-8">
        <span>Déterministe</span>
        <span>Créatif</span>
      </div>
    </div>
  )
}
