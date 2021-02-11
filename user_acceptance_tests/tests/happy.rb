require 'minitest/spec'
require 'minitest/autorun'
require 'rest-client'
require 'json'

describe 'Deployment Tests' do
  let(:service_url) do
    get_service_url_json(
      get_test_input(ENV['TEST_INPUT_FILE_LOCATION'])
    )
  end

  let(:sim_scenario) do
    {
      'id' => 'test_scenario',
      'rpm' => 10,
      'steps' => [
        {
          'name' => 'httpget',
          'params' => [
            'localhost:3001/api/inventory'
          ]
        }
      ]
    }.to_json()
  end

  it 'GET /api/health should return HTTP 200 OK' do
    response = RestClient.get("#{service_url}/api/health")
    expect(response.code).must_equal(200)
  end

  it 'GET /api/scenario should return HTTP 200 OK' do
    response = RestClient.get("#{service_url}/api/scenario")
    expect(response.code).must_equal(200)
  end

  it 'GET /api/scenario/basic_traffic should return the loaded scenario and HTTP 200 OK' do
    response = RestClient.get("#{service_url}/api/scenario/basic_traffic")
    expect(response.code).must_equal(200)
  end

  it 'PUT /api/scenario should return HTTP 200 OK' do
    response = RestClient.put("#{service_url}/api/scenario", sim_scenario, { content_type: :json })
    expect(response.code).must_equal(200)
  end

  it 'POST /api/scenario should return HTTP 200 OK' do
    response = RestClient.post("#{service_url}/api/scenario", sim_scenario, { content_type: :json })
    expect(response.code).must_equal(200)
  end

  it 'DELETE /api/scenario/<id> return HTTP 200 OK' do
    RestClient.post("#{service_url}/api/scenario", sim_scenario, { content_type: :json })
    response = RestClient.delete("#{service_url}/api/scenario/test_scenario")
    expect(response.code).must_equal(200)
  end

  def get_test_input(file_path)
    test_input = File.read(file_path)
    test_input
  end

  def get_service_url_json(test_input)
    service_url = JSON.parse(test_input)
                      .fetch('services', [{}])
                      .first
                      .fetch('urls', [])
                      .first
    if service_url.nil?
      puts 'Test input does not contain a url for testing'
      puts "Test input: \n#{test_input}"
      exit(1)
    else
      service_url
    end
  end

  def get_service_url_regex(test_input)
    service_url = test_input.scan(/testing_endpoint:'(.+)'/)[0][0]

    if service_url.nil?
      puts 'Test input does not contain a url for testing'
      puts "Test input: \n#{test_input}"
      exit(1)
    else
      service_url
    end
  end
end
