use tauri::{AppHandle, Manager};

#[tauri::command]
fn set_title(app_handle: AppHandle, title: String) {
    if let Some(window) = app_handle.get_webview_window("main") {
        let _ = window.set_title(&title);
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![set_title])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
