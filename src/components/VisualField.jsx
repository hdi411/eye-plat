import { useState } from 'react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
         Tooltip, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts'
import { useApp } from '../context/AppContext'

export default function VisualField() {
  const { results, loading, filenames, elapsed, predict, clearResult, classes } = useApp()
  const MODULE    = 'visual-field'
  const result    = results[MODULE]
  const isLoading = loading[MODULE]
  const filename  = filenames[MODULE] || ''
  const ms        = elapsed[MODULE] || 0
  const cls       = classes[MODULE]
  const [drag, setDrag] = useState(false)

  const radarData = result?.probabilities.map(p => ({subject: p.name, A: +(p.prob*100).toFixed(1)})) ?? []
  const barData   = result ? [...result.probabilities].sort((a,b) => b.prob-a.prob) : []
  const activeCls = result ? cls[result.prediction] : null

  function handleFile(file) { predict(MODULE, file) }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">👁 视野缺损分类</div>
          <div className="page-subtitle">上传标准自动视野检查（SAP）图像，AI 自动识别 6 种青光眼缺损模式</div>
        </div>
        {result && <button className="btn btn-sm" onClick={() => clearResult(MODULE)}>↩ 重新上传</button>}
      </div>

      <div className="section-label">上传图像</div>
      {!result
        ? <UploadZone loading={isLoading} onFile={handleFile} drag={drag} setDrag={setDrag}/>
        : <ResultCard result={result} filename={filename} elapsed={ms} classes={cls}/>
      }

      {result && <>
        <div className="section-label" style={{marginTop:22}}>概率分布</div>
        <div className="charts-grid">
          <div className="card">
            <div className="card-header"><div className="card-title">🕸 雷达图</div></div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)"/>
                  <PolarAngleAxis dataKey="subject" tick={{fill:'var(--text3)',fontSize:11}}/>
                  <Radar dataKey="A" stroke="var(--acc)" fill="var(--acc)" fillOpacity={0.12} strokeWidth={1.5}/>
                  <Tooltip contentStyle={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:8,fontSize:12}}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">📊 各类别概率</div></div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData} layout="vertical" margin={{left:4}}>
                  <XAxis type="number" domain={[0,1]} tickFormatter={v=>`${(v*100).toFixed(0)}%`}
                         tick={{fill:'var(--text3)',fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis type="category" dataKey="name" tick={{fill:'var(--text2)',fontSize:11}}
                         axisLine={false} tickLine={false} width={72}/>
                  <Tooltip formatter={v=>`${(v*100).toFixed(1)}%`}
                           contentStyle={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:8,fontSize:12}}/>
                  <Bar dataKey="prob" radius={[0,4,4,0]}>
                    {barData.map((e,i) => <Cell key={i} fill={e.color} fillOpacity={0.75}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="section-label" style={{marginTop:22}}>诊断参考</div>
        {activeCls && (
          <div className="desc-box">
            <div className="desc-box-title" style={{color:activeCls.color}}>
              {activeCls.name} / {activeCls.en}
            </div>
            {activeCls.desc}
            <div className="desc-box-warn">
              ⚠️ 本系统为辅助诊断工具，结果仅供临床参考，最终诊断应由眼科医师判断。
            </div>
          </div>
        )}
      </>}

      <div className="section-label" style={{marginTop:22}}>会话记录</div>
      <HistoryPanel module={MODULE}/>
    </div>
  )
}

function UploadZone({ loading, onFile, drag, setDrag }) {
  function drop(e) { e.preventDefault(); setDrag(false); const f=e.dataTransfer.files[0]; if(f) onFile(f) }
  function pick(e) { if(e.target.files?.[0]) onFile(e.target.files[0]) }
  return (
    <div className={`upload-zone ${drag?'drag':''}`}
         onDragOver={e=>{e.preventDefault();setDrag(true)}}
         onDragLeave={()=>setDrag(false)} onDrop={drop}
         onClick={()=>!loading&&document.getElementById('vf-input')?.click()}>
      <input id="vf-input" type="file" style={{display:'none'}} accept="image/*" onChange={pick}/>
      {loading && <div className="spinner-wrap"><div className="spinner"/><div className="spinner-text">AI 分析中…</div></div>}
      <div className="upload-zone-icon">🖼️</div>
      <div className="upload-zone-title">将图像拖拽至此处上传</div>
      <div className="upload-zone-sub">支持 JPG · PNG · BMP · 推荐分辨率 224×224 以上</div>
      <button className="btn btn-primary btn-sm"
              onClick={e=>{e.stopPropagation();document.getElementById('vf-input')?.click()}}>选择文件</button>
    </div>
  )
}

function ResultCard({ result, filename, elapsed, classes }) {
  const cls    = result.probabilities[result.prediction]
  const sorted = [...result.probabilities].sort((a,b) => b.prob-a.prob)
  return (
    <div className="card" style={{marginBottom:0}}>
      <div className="result-banner">
        <span>✅ 分析完成</span>
        {result.note && <span style={{fontSize:12,color:'var(--text3)'}}>{result.note}</span>}
      </div>
      <div className="result-main">
        <img src={result.thumbnail} alt="图像" className="result-thumb"/>
        <div style={{flex:1}}>
          <div className="result-file">{filename} · 推理耗时 {elapsed} ms</div>
          <div className="result-name" style={{color:cls.color}}>{result.class_name}</div>
          <div className="result-en">{result.class_name_en}</div>
          <div style={{display:'flex',alignItems:'baseline',gap:6,marginBottom:16}}>
            <span className="result-conf" style={{color:cls.color}}>{(result.confidence*100).toFixed(1)}%</span>
            <span style={{fontSize:12,color:'var(--text3)'}}>置信度</span>
          </div>
          {sorted.map(p => (
            <div key={p.id} className="prob-row">
              <div className="prob-row-header">
                <span className="prob-row-name">{p.name}</span>
                <span className="prob-row-pct">{(p.prob*100).toFixed(1)}%</span>
              </div>
              <div className="prob-bar-bg">
                <div className="prob-bar-fill" style={{width:`${p.prob*100}%`,background:p.color}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HistoryPanel({ module }) {
  const { history } = useApp()
  const hist = history.filter(h => h.module === module)
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">📋 本次会话历史</div>
        <span style={{fontSize:12,color:'var(--text3)'}}>刷新后清空</span>
      </div>
      <div className="card-body" style={{padding:'8px 18px'}}>
        {hist.length === 0
          ? <div style={{textAlign:'center',padding:'20px 0',color:'var(--text3)',fontSize:13}}>
              📭 暂无记录，上传图像后自动记录
            </div>
          : hist.map((h,i) => (
            <div key={i} className="hist-row">
              <div className="hist-dot" style={{background:h.color}}/>
              <div className="hist-name">{h.label}</div>
              <div className="hist-conf" style={{color:h.color}}>{(h.conf*100).toFixed(1)}%</div>
              <div className="hist-time">{h.time}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
