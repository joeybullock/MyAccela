 function isSameNode(node1, node2)
{
	if (node1 == null || node1 == undefined || node2 == null || node2 == undefined)
	{
		return false;
	}
	return node1.getID1() == node2.getID1() && node1.getID2() == node2.getID2() && node1.getID3() == node2.getID3();
}

