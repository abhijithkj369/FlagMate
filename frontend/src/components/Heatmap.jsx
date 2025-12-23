import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { Tooltip } from 'react-tooltip'

export default function Heatmap({ values }) {
    const today = new Date()

    return (
        <div className="heatmap-container">
            <CalendarHeatmap
                startDate={new Date(today.getFullYear(), today.getMonth() - 11, 1)}
                endDate={today}
                values={values}
                classForValue={(value) => {
                    if (!value) {
                        return 'color-empty fill-slate-200'
                    }
                    if (value.score > 5) return 'fill-sage-green'
                    if (value.score > 0) return 'fill-sage-light'
                    if (value.score < -5) return 'fill-rose-red'
                    return 'fill-rose-light'
                }}
                tooltipDataAttrs={value => {
                    return {
                        'data-tooltip-id': 'heatmap-tooltip',
                        'data-tooltip-content': value.date ? `${value.date}: Score ${value.score}` : 'No data',
                    }
                }}
            />
            <Tooltip id="heatmap-tooltip" />
        </div>
    )
}
