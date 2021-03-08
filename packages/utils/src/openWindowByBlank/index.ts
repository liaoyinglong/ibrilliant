/**
 * 安全的新建标签打开窗口
 * 去除 新开窗口的window引用相关
 */
export function openWindowByBlank(url?: string) {
  if (!url) {
    return;
  }
  const otherWindow = window.open(url, "_blank", "noopener=yes,noreferrer=yes");
  if (otherWindow) {
    otherWindow.opener = null;
  }
  return otherWindow;
}
