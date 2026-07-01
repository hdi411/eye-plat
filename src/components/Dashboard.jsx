import { useApp } from '../context/AppContext'

const MODULES = [
  { icon:'👁', title:'视野缺损分类', sub:'Visual Field Analysis',
    desc:'上传标准自动视野检查（SAP）图像，AI 自动识别 6 种青光眼视野缺损模式。',
    id:'visual-field', tags:['ResNet-34','CBAM','6 类别','< 200 ms'], ready:true },
  { icon:'🏥', title:'眼底图像分析', sub:'Fundus Photography',
    desc:'上传眼底照相图像，筛查青光眼、糖尿病视网膜病变、黄斑变性等。',
    id:'fundus', tags:['多病种筛查','开发中'], ready:false },
  { icon:'🩻', title:'OCT 结构分析', sub:'OCT Structural Analysis',
    desc:'上传 OCT 扫描图像，检测视网膜层厚度异常，识别水肿、脱离等病变。',
    id:'oct', tags:['视网膜分层','开发中'], ready:false },
  { icon:'📋', title:'报告中心', sub:'Report Center',
    desc:'查看历史分析记录，按模块和日期筛选，导出 PDF 诊断报告。',
    id:'reports', tags:['PDF 导出','开发中'], ready:false },
]

export default function Dashboard({ onNavigate }) {
  const { history } = useApp()

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">🔬 眼科 AI 诊断平台</div>
          <div className="page-subtitle">
            <span className="live-dot"/> 演示模式 · 基于深度学习的多模态眼科影像分析
          </div>
        </div>
      </div>

      {/* 检查模块 */}
      <div className="section-label">检查模块</div>
      <div className="module-grid">
        {MODULES.map(m => (
          <div key={m.id} className="module-card" onClick={() => onNavigate(m.id)}>
            <div className="module-card-icon">{m.icon}</div>
            <div className="module-card-title">{m.title}</div>
            <div className="module-card-sub">{m.sub}</div>
            <div className="module-card-desc">{m.desc}</div>
            <div className="module-card-footer">
              <div className="module-tags">
                {m.tags.map(t => <span key={t} className="module-tag">{t}</span>)}
              </div>
              {m.ready
                ? <span className="pill pill-ok">已就绪</span>
                : <span className="pill pill-warn">开发中</span>}
            </div>
          </div>
        ))}
      </div>

      {/* 最近记录 */}
      {history.length > 0 && <>
        <div className="section-label" style={{marginTop:22}}>最近记录</div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">📋 会话历史</div>
            <span style={{fontSize:12,color:'var(--text3)'}}>{history.length} 条</span>
          </div>
          <div className="card-body" style={{padding:'8px 18px'}}>
            {history.slice(0,6).map((h,i) => (
              <div key={i} className="hist-row">
                <div className="hist-dot" style={{background:h.color}}/>
                <div className="hist-name">{h.label}</div>
                <span className="pill" style={{background:h.color+'18',color:h.color,fontSize:10}}>{h.module}</span>
                <div className="hist-conf" style={{color:h.color}}>{(h.conf*100).toFixed(1)}%</div>
                <div className="hist-time">{h.time}</div>
              </div>
            ))}
          </div>
        </div>
      </>}
    </div>
  )
}
