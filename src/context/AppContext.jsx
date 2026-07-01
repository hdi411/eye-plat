import { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

const CLASSES = {
  'visual-field': [
    { id:0, name:'正常',      en:'Normal',              color:'#4e8a5c', desc:'视野范围及光敏度均在正常范围内，暂无缺损迹象。' },
    { id:1, name:'旁中心暗点', en:'Paracentral Scotoma', color:'#b8865a', desc:'中心注视点旁出现局限性暗点，常见于青光眼早期。' },
    { id:2, name:'鼻侧阶梯',  en:'Nasal Step',          color:'#b03030', desc:'沿水平中线的鼻侧出现阶梯状缺损，青光眼典型早期体征。' },
    { id:3, name:'弓形缺损',  en:'Arcuate Defect',      color:'#3a72b0', desc:'沿弓形纤维束走行的弓状暗点，绕过中心注视点。' },
    { id:4, name:'环形暗点',  en:'Ring Scotoma',        color:'#9a4a1a', desc:'视野中形成封闭环状暗区，提示上下弓形缺损汇合。' },
    { id:5, name:'管状视野',  en:'Tubular Vision',      color:'#7a3a9a', desc:'仅保留中央管状视野，周边大范围缺损，见于晚期青光眼。' },
  ],
  'fundus': [
    { id:0, name:'正常',     en:'Normal',               color:'#4e8a5c', desc:'' },
    { id:1, name:'青光眼',   en:'Glaucoma',             color:'#b03030', desc:'' },
    { id:2, name:'糖网病',   en:'Diabetic Retinopathy', color:'#b87a20', desc:'' },
    { id:3, name:'黄斑变性', en:'AMD',                  color:'#7a3a9a', desc:'' },
  ],
  'oct': [
    { id:0, name:'正常',      en:'Normal',              color:'#4e8a5c', desc:'' },
    { id:1, name:'视网膜水肿', en:'Retinal Edema',      color:'#3a72b0', desc:'' },
    { id:2, name:'视网膜脱离', en:'Retinal Detachment', color:'#b03030', desc:'' },
    { id:3, name:'黄斑裂孔',  en:'Macular Hole',       color:'#b87a20', desc:'' },
  ],
}

function mockResult(file, classes) {
  const raw   = classes.map(() => Math.random())
  const sum   = raw.reduce((a,b) => a+b, 0)
  const probs = raw.map(v => v/sum)
  const idx   = probs.indexOf(Math.max(...probs))
  return {
    prediction:    idx,
    class_name:    classes[idx].name,
    class_name_en: classes[idx].en,
    confidence:    probs[idx],
    probabilities: classes.map((c,i) => ({...c, prob: probs[i]})),
    thumbnail:     URL.createObjectURL(file),
    note:          '演示模式 — 未连接后端',
  }
}

const API_BASE = 'http://localhost:8000'

export function AppProvider({ children }) {
  const [results,   setResults]   = useState({})
  const [loading,   setLoading]   = useState({})
  const [filenames, setFilenames] = useState({})
  const [elapsed,   setElapsed]   = useState({})
  const [history,   setHistory]   = useState([])

  const predict = useCallback(async (module, file) => {
    const classes = CLASSES[module]
    setLoading(l  => ({...l, [module]: true}))
    setFilenames(f => ({...f, [module]: file.name}))

    const t0 = performance.now()
    let data
    try {
      const fd = new FormData()
      fd.append('file', file)
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 3000)
      const r = await fetch(`${API_BASE}/api/${module}/predict`, {
        method: 'POST', body: fd, signal: controller.signal
      })
      clearTimeout(timer)
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      data = await r.json()
    } catch {
      data = mockResult(file, classes)
    }
    const ms = Math.round(performance.now() - t0)

    setResults(r  => ({...r,  [module]: data}))
    setElapsed(e  => ({...e,  [module]: ms}))
    setLoading(l  => ({...l,  [module]: false}))
    setHistory(h  => [{
      module,
      label: data.class_name,
      conf:  data.confidence,
      color: classes[data.prediction].color,
      time:  new Date().toLocaleTimeString('zh-CN', {hour:'2-digit', minute:'2-digit'}),
    }, ...h].slice(0, 20))
  }, [])

  const clearResult = useCallback((module) => {
    setResults(r => ({...r, [module]: null}))
  }, [])

  return (
    <AppContext.Provider value={{ results, loading, filenames, elapsed, history, predict, clearResult, classes: CLASSES }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
