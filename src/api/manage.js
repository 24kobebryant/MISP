import network from './network';

function getAction(url) {
  return network({
    url: url,
    method: "get",
  });
}

function postAction(url, data) {
  return network({
    url: url,
    method: "post",
    data
  })
}

export {
  getAction, 
  postAction
}