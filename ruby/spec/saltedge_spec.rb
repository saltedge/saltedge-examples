require_relative "../saltedge"

describe "Saltedge" do
	let(:saltedge)  { Saltedge.new("CLIENT_ID", "SERVICE_SECRET", "private_pem_path") }
	let(:digest)    { OpenSSL::Digest::SHA1.new }
	let(:rsa_key)   { double }
	let(:hash) 			{ {
		:method 		=> "GET",
		:url    		=> "http://example.com",
		:expires_at => 12345678,
		:params 		=> ""
		}
	}

	describe "#new" do
    it "takes three parameters and returns a Saltedge object" do
      expect(saltedge).to be_an_instance_of(Saltedge)
    end
	end

	describe "#request" do
		it "execute request" do
			expect(Time).to receive(:now).and_return(12345678 - 60)
			expect(saltedge).to receive(:signature).with(hash).and_return("some string")

			expect(RestClient::Request).to receive(:execute).with(
				method:  "GET",
    	  url:     "http://example.com",
    	  payload: "",
    	  headers: {
    	  	"Accept" => "application/json",
        	"Content-type"   => "application/json",
	        "Expires-at"     => hash[:expires_at],
	        "Signature"      => "some string",
	        "Client-id"      => "CLIENT_ID",
	        "Service-secret" => "SERVICE_SECRET"
    	  }
    	 )

			saltedge.request("GET", "http://example.com", {})
		end
	end

	describe "#signature" do
		it "should return encrypted signature" do
			item    = {
      	method:     "method",
      	url:        "url",
      	expires_at: 1445529216,
      	params:     ""
    	}
			expect(OpenSSL::PKey::RSA).to receive(:new).with("private_pem_path").and_return(rsa_key)
			expect(rsa_key).to receive(:sign).with(saltedge.send(:digest), "1445529216|method|url|").and_return("some string")
			expect(Base64).to receive(:encode64).with("some string")
      saltedge.send(:signature, item)
		end
	end

	describe "#rsa_key" do
		it "should create an instance of RSA" do
			expect(OpenSSL::PKey::RSA).to receive(:new).with("private_pem_path")
			saltedge.send(:rsa_key)
		end
	end

	describe "#digest" do
		it "returns an instance of SHA1" do
			expect(digest).to be_an_instance_of(OpenSSL::Digest::SHA1)
		end
	end
end