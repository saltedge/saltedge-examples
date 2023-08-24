require "openssl"

module Keychain
  CERT_DIR = File.join(__dir__, "cert")
  CONFIG   = YAML.load_file(File.join(__dir__, "config.yml"))

  class << self
    def ssa
      File.read(File.join(CERT_DIR, "ssa.jwt"))
    end

    def method_missing(method_name)
      method_name_str = method_name.to_s
      name            = method_name_str.split("_")[0..-2].join("_")

      if method_name_str.end_with?("_key")
        key(name)
      elsif method_name_str.end_with?("_cert") || method_name_str.end_with?("_pem")
        cert(name)
      elsif CONFIG.key?(method_name_str)
        CONFIG[method_name_str]
      else
        super
      end
    end

    def key(name)
      OpenSSL::PKey::RSA.new(File.read(File.join(CERT_DIR, "#{name}.key")))
    end

    def cert(name)
      OpenSSL::X509::Certificate.new(File.read(File.join(CERT_DIR, "#{name}.pem")))
    end
  end
end
