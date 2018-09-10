 function getRoots(nodeId)
{
	var rootsArray = new Array();
	var directParentsResult = aa.cap.getProjectByChildCapID(nodeId,'R',null);
	
    if (directParentsResult.getSuccess())
    {
		tmpdirectParents = directParentsResult.getOutput();
		for(ff in tmpdirectParents) {
			if (tmpdirectParents[ff]) {
				
				var tmpNode = getRootNode(tmpdirectParents[ff].getProjectID(), 1);
				var id1 = tmpNode.getID1();
				var id2 = tmpNode.getID2();
				var id3 = tmpNode.getID3();
				var pCapId = aa.cap.getCapID(id1,id2,id3).getOutput();
				rootsArray.push(pCapId);
			}
		}
    }
	return rootsArray;
}

