export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

const toasts = ref<Toast[]>([]);
let counter = 0;

export function useToast() {
  function show(message: string, type: ToastType = "info", duration = 3500) {
    const id = ++counter;
    toasts.value.push({ id, type, message });

    setTimeout(() => remove(id), duration);
  }

  function remove(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  return {
    toasts,
    success: (msg: string, duration?: number) => show(msg, "success", duration),
    error: (msg: string, duration?: number) => show(msg, "error", duration),
    info: (msg: string, duration?: number) => show(msg, "info", duration),
    warning: (msg: string, duration?: number) => show(msg, "warning", duration),
    remove,
  };
}
