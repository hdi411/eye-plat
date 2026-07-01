import { useApp } from '../context/AppContext'

function NavItem({ icon, label, id, page, onNavigate, badge }) {
  return (
    <div className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => onNavigate(id)}>
      <span>{icon}</span>
      {label}
      {badge && <span className={`nav-badge ${badge.cls}`}>{badge.text}</span>}
    </div>
  )
}

export default function Layout({ page, onNavigate, children }) {
  const { history } = useApp()
  return (
    <>
      <div className="topnav">
        <div className="nav-logo">🔬</div>
        <div>
          <div className="nav-brand">眼科 AI 诊断平台</div>
          <div className="nav-brand-sub">Ophthalmology AI Platform</div>
        </div>
        <div className="nav-divider"/>
        <div className="nav-spacer"/>
        <span className="nav-demo-badge">演示模式</span>
      </div>
      <div className="main-body">
        <div className="sidebar">
          <div className="nav-section">检查模块</div>
          <NavItem icon="📊" label="总览"        id="dashboard"    page={page} onNavigate={onNavigate}/>
          <NavItem icon="👁" label="视野缺损分类" id="visual-field" page={page} onNavigate={onNavigate}
            badge={{text:'就绪', cls:'nb-ok'}}/>
          <NavItem icon="🏥" label="眼底图像分析" id="fundus"       page={page} onNavigate={onNavigate}/>
          <NavItem icon="🩻" label="OCT 结构分析" id="oct"          page={page} onNavigate={onNavigate}/>
          <div className="nav-section">记录与报告</div>
          <NavItem icon="📋" label="报告中心"     id="reports"      page={page} onNavigate={onNavigate}
            badge={history.length > 0 ? {text: history.length, cls:'nb-warn'} : null}/>
          <div className="nav-section">关于</div>
          <NavItem icon="🤖" label="模型信息"     id="model-info"   page={page} onNavigate={onNavigate}/>
        </div>
        <div className="content-area">{children}</div>
      </div>
    </>
  )
}
