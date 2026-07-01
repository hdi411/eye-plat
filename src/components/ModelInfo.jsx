export default function ModelInfo() {
  const rows = [
    ['模型架构', 'ResNet-34 + CBAM（通道 & 空间注意力）'],
    ['任务类型', '多分类（6 类青光眼视野缺损）'],
    ['输入格式', 'RGB 图像，建议 224×224 px'],
    ['输出格式', 'Softmax 概率分布（6 维）'],
    ['数据集',   'UWHVF（华盛顿大学 Humphrey 视野数据集）'],
    ['数据增强', 'WGAN-GP 生成对抗网络'],
    ['后端框架', 'FastAPI + PyTorch'],
    ['前端框架', 'Vite + React + Recharts'],
    ['API 地址', 'POST http://localhost:8000/api/visual-field/predict'],
  ]
  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">🤖 模型信息</div>
        <div className="page-subtitle">AI 模型架构与技术栈说明</div></div>
      </div>
      <div className="section-label">技术规格</div>
      <div className="card">
        <table className="data-table">
          <tbody>
            {rows.map(([k,v]) => (
              <tr key={k}>
                <td style={{color:'var(--text3)',fontWeight:500,width:160}}>{k}</td>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
