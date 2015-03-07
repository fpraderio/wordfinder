<?php
    header('Access-Control-Allow-Origin: *');
	
	require_once("Rest.inc.php");
	
	class API extends REST {
	
		public $data = "";
			
		public function __construct(){
			// Init parent contructor
			parent::__construct();
		}
		
		/*
		 * Public method for access api.
		 * This method dynmically call the method based on the query string
		 *
		 */
		public function processApi(){
			$path = $this->get_request_method() . strtolower($_REQUEST['rquest']);
			
			switch ($path) {
			    case "GETcatalogs":
			    	$this->get_catalogs();
			        break;
			    case (preg_match("/GETcatalogs\/(.[A-Za-z0-9_]+)$/", $path, $ids) ? true : false):
			        $this->get_catalog($ids[1]);
			        break;
			    case (preg_match("/GETcatalogs\/(.[A-Za-z0-9_]+)\/documents$/", $path, $ids) ? true : false):
			        $this->get_catalog_documents($ids[1]);
			        break;
			    case (preg_match("/GETcatalogs\/(.[A-Za-z0-9_]+)\/documents\/(.[A-Za-z0-9_]+)$/", $path, $ids) ? true : false):
			        $this->get_document($ids[1], $ids[2]);
			        break;
			    case (preg_match("/GETcatalogs\/(.[A-Za-z0-9_]+)\/documents\/(.[A-Za-z0-9_]+)\/pages$/", $path, $ids) ? true : false):
			        $this->get_document_pages($ids[1], $ids[2]);
			        break;
			    default:
			        $this->response('NOT FOUND:' . $path,404);
			}
		}

		//GET catalogs/
		private function get_catalogs(){	
			// Cross validation if the request method is GET else it will return "Not Acceptable" status
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$dir = "db/catalogs/";
			//get all directories unless '.' and '..'
			$subdirs = array_diff(scandir($dir), array(".", ".."));
			if(!empty($subdirs)) {
				$result = array();
				foreach ($subdirs as $value) {
				    array_push($result, $value);
				}
				$this->response($this->json($result), 200);

			}else {
				$this->response('',204);	// If no records "No Content" status

			}
			
		}

		//GET catalogs/gasetamunicipalbarcelona/
		private function get_catalog($id){	
			// Cross validation if the request method is GET else it will return "Not Acceptable" status
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}

			$file = "db/catalogs/" . $id . "/info.json";
			$json = file_get_contents($file);
			if(!empty($json)) {
				$this->response($json, 200);

			}else {
				$this->response('',204);	// If no records "No Content" status

			}
		}

		//GET catalogs/gasetamunicipalbarcelona/documents/
		private function get_catalog_documents($id){	
			// Cross validation if the request method is GET else it will return "Not Acceptable" status
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}

			$dir = "db/catalogs/" . $id . "/documents/";
			//get all directories unless '.' and '..'
			$subdirs = array_diff(scandir($dir), array(".", ".."));
			if(!empty($subdirs)) {
				$result = array();
				foreach ($subdirs as $value) {
				    array_shift($result, strstr($value, '.', true));
				}
				$this->response($this->json($result), 200);

			}else {
				$this->response('',204);	// If no records "No Content" status

			}
		}

		//GET catalogs/gasetamunicipalbarcelona/documents/2015_01_03
		private function get_document($idCatalog, $idDocument){	
			// Cross validation if the request method is GET else it will return "Not Acceptable" status
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$file = "db/catalogs/" . $idCatalog . "/documents/" . $idDocument . ".json";
			$json = file_get_contents($file);
			if(!empty($json)) {
				$this->response($json, 200);

			}else {
				$this->response('',204);	// If no records "No Content" status

			}
		}

		//GET catalogs/gasetamunicipalbarcelona/documents/2015_01_03/pages
		private function get_document_pages($idCatalog, $idDocument){	
			// Cross validation if the request method is GET else it will return "Not Acceptable" status
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}


			$contains = $this->_request['contains'];

			$file = "db/catalogs/" . $idCatalog . "/documents/" . $idDocument . ".json";
			$json_file = file_get_contents($file);
			$json = json_decode($json_file, true);
			$delimiter = "";
			switch ($idCatalog) {
			    case "gasetamunicipalbarcelona":
			    	$delimiter = "GASETA MUNICIPAL DE BARCELONA";
			        break;
			    }
			$explode = explode($delimiter, $json['content']);
			$pages = array();
			foreach ($explode as $key => $value) {
				$page = [
				    "num_page" => $key+1,
				    "content" => $value,
				];
				array_push($pages, $page);
			}
			$result = $pages;
			if(!empty($contains)){
				$result = array();
				foreach ($pages as $key => $value) {
					if (stripos($value["content"],$contains) !== false){
						array_push($result, $value);
					}
				}
			}
			if (!empty($result)){
				$this->response($this->json($result), 200);
			}else {
				$this->response('',204);	// If no records "No Content" status

			}
		}
		
		/*
		 *	Encode array into JSON
		*/
		private function json($data){
			if(is_array($data)){
				return json_encode($data);
			}
		}
	}
	
	// Initiiate Library
	
	$api = new API;
	$api->processApi();
?>