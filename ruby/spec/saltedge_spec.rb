require_relative "../saltedge"

describe "Saltedge" do
  let(:saltedge)  { Saltedge.new("CLIENT_ID", "SERVICE_SECRET", "../private.pem") }
  let(:digest)    { OpenSSL::Digest::SHA1.new }
  let(:rsa_key)   { double }
  let(:hash)      {
    {
      method:     "GET",
      url:        "http://example.com",
      expires_at: 12345678,
      params:     "",
    }
  }

  describe "#new" do
    it "takes three parameters and returns a Saltedge object" do
      expect(saltedge).to be_an_instance_of(Saltedge)
    end
  end

  describe "#request" do
    it "execute request" do
      expect(Time).to     receive(:now).and_return(12345678 - 60)
      expect(saltedge).to receive(:sign_request).with(hash).and_return("some string")

      expect(RestClient::Request).to receive(:execute).with(
        method:  "GET",
        url:     "http://example.com",
        payload: "",
        headers: {
          "Accept"         => "application/json",
          "Content-type"   => "application/json",
          "Expires-at"     => hash[:expires_at],
          "Signature"      => "some string",
          "Client-id"      => "CLIENT_ID",
          "Service-secret" => "SERVICE_SECRET",
        }
       )

      saltedge.request("GET", "http://example.com", {})
    end
  end

  describe "#verify_signature" do
    it "verifies signature" do
      url       = "https://www.client.com/api/callbacks/success"
      params    = {data: {connection_id: 1234, customer_id: 4321, custom_fields: {}}, meta: {version: "6", time: "2025-01-03T13:00:28Z"}}
      data      = "#{url}|#{params}"
      signature = "ZwaDZmysX5MhucepoFcqCNNPY/yDAaqzfnHRwbnlzxgTz925dtlX3nWYgeWWwp0W2nxzK8PNd0yndgohmm790BarN4x88CxhvB+nPl2sUChyxMRoqa3ybXTKHFJXutuJZPUctBZqIU1rSEqqg99D4NTNj43GpigLubiPM6qZto7mvuMqP7HQ/ymJPa4CeKQKBO0Zg196keCX76X8XTyWL0CjxyPER3tZ9DEyPQvcwMXmbO8zO9ZoVeJ1JTeiqYJrvUbZg9Ncw0aK3469iYtp+wCu5p3PFx0lou3Nn8/W9fKuQMVWEl03Ura52w9x7YU6D6enDta6/9IRuq10xKkuDg=="

      public_key = OpenSSL::PKey::RSA.new(File.read(File.join(File.dirname(__FILE__), "../../spectre_public.pem")))
      expect(saltedge.verify_signature(public_key, data, signature)).to eq(true)
    end
  end

  describe "#sign_request" do
    it "should return encrypted signature" do
      item = {
        method:     "method",
        url:        "url",
        expires_at: 1445529216,
        params:     "",
      }
      expect(OpenSSL::PKey::RSA).to receive(:new).with(saltedge.private_pem_path).and_return(rsa_key)
      expect(rsa_key).to receive(:sign).with(saltedge.send(:digest), "1445529216|method|url|").and_return("some string")
      expect(Base64).to  receive(:encode64).with("some string").and_return(double(delete: nil))
      saltedge.send(:sign_request, item)
    end
  end

  describe "#rsa_key" do
    it "should create an instance of RSA" do
      expect(OpenSSL::PKey::RSA).to receive(:new).with(saltedge.private_pem_path)
      saltedge.send(:rsa_key)
    end
  end

  describe "#digest" do
    it "returns an instance of SHA1" do
      expect(digest).to be_an_instance_of(OpenSSL::Digest::SHA1)
    end
  end
end
