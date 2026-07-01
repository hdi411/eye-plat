import { useApp } from '../context/AppContext'
const LABELS = { 'visual-field':'视野缺损', 'fundus':'眼底图像', 'oct':'OCT 扫描' }
export default function Reports() {
  const { history } = useApp()
  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">📋 报告中心</div>
        <div className="page-subtitle">Report Center · 会话历史记录</div></div>
        <span className="pill pill-warn">PDF 导出开发中</span>
      </div>
      <div className="section-label">会话分析记录</div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">全模块历史</div>
          <span style={{fontSize:12,color:'var(--text3)'}}>{history.length} 条</span>
        </div>
        {history.length === 0
          ? <div className="card-body" style={{textAlign:'center',color:'var(--text3)'}}>📭 暂无记录</div>
          : <table className="data-table">
              <thead><tr><th>#</th><th>模块</th><th>结果</th><th>置信度</th><th>时间</th></tr></thead>
              <tbody>
                {history.map((h,i) => (
                  <tr key={i}>
                    <td style={{color:'var(--text3)'}}>{history.length-i}</td>
                    <td>{LABELS[h.module]||h.module}</td>
                    <td><span style={{display:'inline-flex',alignItems:'center',gap:6}}>
                      <span style={{width:8,height:8,borderRadius:'50%',background:h.color,display:'inline-block'}}/>
                      {h.label}
                    </span></td>
                    <td style={{color:h.color,fontWeight:600}}>{(h.conf*100).toFixed(1)}%</td>
                    <td style={{color:'var(--text3)'}}>{h.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </div>
    </div>
  )
}
