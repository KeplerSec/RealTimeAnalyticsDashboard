#include <napi.h>
#include <vector>

Napi::Value ComputeAverage(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 1 || !info[0].IsArray()) {
    Napi::TypeError::New(env, "Array expected").ThrowAsJavaScriptException();
    return env.Null();
  }
  Napi::Array data = info[0].As<Napi::Array>();
  double sum = 0;
  uint32_t len = data.Length();
  for (uint32_t i = 0; i < len; i++) {
    sum += data.Get(i).As<Napi::Number>().DoubleValue();
  }
  return Napi::Number::New(env, len > 0 ? sum / len : 0);
}

// Réutiliser SHA-256 de SecureUserAPI (hashPassword, verifyPassword)
Napi::Value HashPassword(const Napi::CallbackInfo& info) {
  // Copier depuis SecureUserAPI
  return Napi::String::New(info.Env(), "TODO: Implement");
}

Napi::Value VerifyPassword(const Napi::CallbackInfo& info) {
  // Copier depuis SecureUserAPI
  return Napi::Boolean::New(info.Env(), false);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("computeAverage", Napi::Function::New(env, ComputeAverage));
  exports.Set("hashPassword", Napi::Function::New(env, HashPassword));
  exports.Set("verifyPassword", Napi::Function::New(env, VerifyPassword));
  return exports;
}

NODE_API_MODULE(analyticsAddon, Init)